/**
 * Audio Player Service
 *
 * Manages audio playback using expo-av
 * Handles play, pause, seek, speed control, and background audio
 */

import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
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

class AudioService {
  private sound: Audio.Sound | null = null;
  private currentEpisode: Episode | null = null;
  private listeners: Set<StateListener> = new Set();
  private state: AudioPlayerState = {
    status: 'idle',
    currentEpisode: null,
    position: 0,
    duration: 0,
    playbackSpeed: 1.0,
    error: null,
  };

  constructor() {
    this.initializeAudio();
  }

  /**
   * Initialize audio session
   */
  private async initializeAudio(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

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
   * Load and play an episode
   */
  async loadEpisode(episode: Episode, startPosition?: number): Promise<void> {
    try {
      this.updateState({ status: 'loading', error: null });

      // Unload previous sound if any
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Get audio URL
      const uri = episodesService.getAudioUrl(episode);

      // Load sound
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          shouldPlay: true,
          positionMillis: startPosition || 0,
          rate: this.state.playbackSpeed,
        },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
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
        error: 'Failed to load audio file',
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

    if (!this.sound) {
      if (this.currentEpisode) {
        await this.loadEpisode(this.currentEpisode);
      }
      return;
    }

    await this.sound.playAsync();
    this.updateState({ status: 'playing' });
  }

  /**
   * Pause playback
   */
  async pause(): Promise<void> {
    if (!this.sound) return;

    await this.sound.pauseAsync();
    this.updateState({ status: 'paused' });

    // Save progress
    if (this.currentEpisode) {
      await storageService.saveProgress(
        this.currentEpisode.id,
        this.state.position / 1000,
        this.state.duration / 1000
      );
    }
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
    if (!this.sound) return;

    await this.sound.setPositionAsync(positionMillis);

    // Save progress
    if (this.currentEpisode) {
      await storageService.saveProgress(
        this.currentEpisode.id,
        positionMillis / 1000,
        this.state.duration / 1000
      );
    }
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
    if (!this.sound) {
      this.updateState({ playbackSpeed: speed });
      return;
    }

    await this.sound.setRateAsync(speed, true);
    await storageService.setPlaybackSpeed(speed);
    this.updateState({ playbackSpeed: speed });
  }

  /**
   * Stop playback and unload
   */
  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
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
   * Playback status update callback
   */
  private onPlaybackStatusUpdate = (status: AVPlaybackStatus): void => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error('Playback error:', status.error);
        this.updateState({
          status: 'error',
          error: status.error,
        });
      }
      return;
    }

    const successStatus = status as AVPlaybackStatusSuccess;

    // Update position and duration
    this.updateState({
      position: successStatus.positionMillis,
      duration: successStatus.durationMillis || 0,
    });

    // Check if playback finished
    if (successStatus.didJustFinish) {
      this.handlePlaybackFinished();
    }

    // Update buffering status
    if (successStatus.isBuffering) {
      this.updateState({ status: 'buffering' });
    } else if (successStatus.isPlaying) {
      this.updateState({ status: 'playing' });
    } else {
      this.updateState({ status: 'paused' });
    }
  };

  /**
   * Handle playback finished
   */
  private async handlePlaybackFinished(): Promise<void> {
    if (!this.currentEpisode) return;

    // Mark as completed
    await storageService.markCompleted(
      this.currentEpisode.id,
      this.state.duration / 1000
    );

    this.updateState({ status: 'paused', position: this.state.duration });

    // TODO: Auto-play next episode if desired
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
export const audioService = new AudioService();
