/**
 * Web Audio Player Service
 *
 * Uses HTML5 Audio API for web browsers
 * This is used instead of expo-av which doesn't work reliably on web
 */

import { Episode } from '../types/episode';
import { storageService } from './storageService';
import { episodesService } from './episodesService';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error';

export interface AudioPlayerState {
  status: PlaybackStatus;
  currentEpisode: Episode | null;
  position: number; // milliseconds
  duration: number; // milliseconds
  playbackSpeed: number;
  error: string | null;
}

type StateListener = (state: AudioPlayerState) => void;

class WebAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentEpisode: Episode | null = null;
  private listeners: Set<StateListener> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;
  private state: AudioPlayerState = {
    status: 'idle',
    currentEpisode: null,
    position: 0,
    duration: 0,
    playbackSpeed: 1.0,
    error: null,
  };

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.state);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<AudioPlayerState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  /**
   * Setup audio element event listeners
   */
  private setupAudioListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        this.updateState({
          duration: this.audio.duration * 1000,
        });
      }
    });

    this.audio.addEventListener('playing', () => {
      this.updateState({ status: 'playing' });
      this.startPositionUpdates();
    });

    this.audio.addEventListener('pause', () => {
      this.updateState({ status: 'paused' });
      this.stopPositionUpdates();
      this.saveProgress();
    });

    this.audio.addEventListener('ended', () => {
      this.handlePlaybackFinished();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.updateState({
        status: 'error',
        error: 'Failed to load audio file',
      });
    });

    this.audio.addEventListener('waiting', () => {
      this.updateState({ status: 'buffering' });
    });

    this.audio.addEventListener('canplay', () => {
      if (this.state.status === 'buffering') {
        this.updateState({ status: this.audio!.paused ? 'paused' : 'playing' });
      }
    });
  }

  /**
   * Start updating position periodically
   */
  private startPositionUpdates(): void {
    this.stopPositionUpdates();
    this.updateInterval = setInterval(() => {
      if (this.audio && !this.audio.paused) {
        this.updateState({
          position: this.audio.currentTime * 1000,
        });
      }
    }, 100); // Update every 100ms
  }

  /**
   * Stop position updates
   */
  private stopPositionUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Load and play an episode
   */
  async loadEpisode(episode: Episode, startPosition?: number): Promise<void> {
    try {
      this.updateState({ status: 'loading', error: null });

      // Cleanup previous audio
      if (this.audio) {
        this.stopPositionUpdates();
        this.audio.pause();
        this.audio.src = '';
        this.audio = null;
      }

      // Create new audio element
      this.audio = new Audio();
      this.setupAudioListeners();

      // Get audio URL
      const uri = episodesService.getAudioUrl(episode);
      this.audio.src = uri;
      this.audio.playbackRate = this.state.playbackSpeed;

      // Set start position if provided
      if (startPosition) {
        this.audio.currentTime = startPosition / 1000;
      }

      // Start playback
      await this.audio.play();

      this.currentEpisode = episode;

      // Save as last played episode
      await storageService.setLastEpisodeId(episode.id);

      this.updateState({
        status: 'playing',
        currentEpisode: episode,
      });
    } catch (error) {
      console.error('Error loading episode:', error);
      this.updateState({
        status: 'error',
        error: 'Failed to load audio file. Please check your internet connection.',
      });
    }
  }

  /**
   * Play current or specified episode
   */
  async play(episode?: Episode): Promise<void> {
    if (episode && episode.id !== this.currentEpisode?.id) {
      // Load and play new episode
      const progress = await storageService.getProgress(episode.id);
      const startPosition = progress?.position ? progress.position * 1000 : 0;
      await this.loadEpisode(episode, startPosition);
      return;
    }

    if (!this.audio) {
      if (this.currentEpisode) {
        await this.loadEpisode(this.currentEpisode);
      }
      return;
    }

    try {
      await this.audio.play();
      this.updateState({ status: 'playing' });
    } catch (error) {
      console.error('Error playing audio:', error);
      this.updateState({
        status: 'error',
        error: 'Failed to play audio',
      });
    }
  }

  /**
   * Pause playback
   */
  async pause(): Promise<void> {
    if (!this.audio) return;

    this.audio.pause();
    this.updateState({ status: 'paused' });
    await this.saveProgress();
  }

  /**
   * Toggle play/pause
   */
  async togglePlayPause(): Promise<void> {
    if (this.state.status === 'playing') {
      await this.pause();
    } else {
      await this.play();
    }
  }

  /**
   * Seek to position (in milliseconds)
   */
  async seekTo(positionMillis: number): Promise<void> {
    if (!this.audio) return;

    this.audio.currentTime = positionMillis / 1000;
    this.updateState({ position: positionMillis });

    await this.saveProgress();
  }

  /**
   * Skip forward by seconds
   */
  async skipForward(seconds: number = 30): Promise<void> {
    const newPosition = Math.min(
      this.state.position + seconds * 1000,
      this.state.duration
    );
    await this.seekTo(newPosition);
  }

  /**
   * Skip backward by seconds
   */
  async skipBackward(seconds: number = 30): Promise<void> {
    const newPosition = Math.max(this.state.position - seconds * 1000, 0);
    await this.seekTo(newPosition);
  }

  /**
   * Set playback speed
   */
  async setPlaybackSpeed(speed: number): Promise<void> {
    if (this.audio) {
      this.audio.playbackRate = speed;
    }
    await storageService.setPlaybackSpeed(speed);
    this.updateState({ playbackSpeed: speed });
  }

  /**
   * Stop playback and unload
   */
  async stop(): Promise<void> {
    if (this.audio) {
      this.stopPositionUpdates();
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }

    this.updateState({
      status: 'idle',
      currentEpisode: null,
      position: 0,
      duration: 0,
    });
  }

  /**
   * Get current state
   */
  getState(): AudioPlayerState {
    return this.state;
  }

  /**
   * Save current progress
   */
  private async saveProgress(): Promise<void> {
    if (this.currentEpisode && this.audio) {
      await storageService.saveProgress(
        this.currentEpisode.id,
        this.audio.currentTime,
        this.audio.duration
      );
    }
  }

  /**
   * Handle playback finished
   */
  private async handlePlaybackFinished(): Promise<void> {
    if (!this.currentEpisode || !this.audio) return;

    // Mark as completed
    await storageService.markCompleted(
      this.currentEpisode.id,
      this.audio.duration
    );

    this.updateState({
      status: 'paused',
      position: this.audio.duration * 1000
    });

    this.stopPositionUpdates();
  }

  /**
   * Load last played episode and resume
   */
  async resumeLastEpisode(): Promise<void> {
    const lastEpisodeId = await storageService.getLastEpisodeId();
    if (!lastEpisodeId) return;

    const episode = await episodesService.getEpisodeById(lastEpisodeId);
    if (!episode) return;

    const progress = await storageService.getProgress(lastEpisodeId);
    const startPosition = progress?.position ? progress.position * 1000 : 0;

    await this.loadEpisode(episode, startPosition);
  }
}

// Export singleton instance
export const webAudioService = new WebAudioService();
