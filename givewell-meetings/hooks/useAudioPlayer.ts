/**
 * Audio Player Hook
 *
 * React hook that wraps the audio service for easy use in components
 */

import { useEffect, useState } from 'react';
import { audioService, AudioPlayerState } from '../services/audioService';
import { Episode } from '../types/episode';

export function useAudioPlayer() {
  const [playerState, setPlayerState] = useState<AudioPlayerState>(audioService.getState());

  useEffect(() => {
    // Subscribe to audio service updates
    const unsubscribe = audioService.subscribe(setPlayerState);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    // State
    status: playerState.status,
    currentEpisode: playerState.currentEpisode,
    position: playerState.position,
    duration: playerState.duration,
    playbackSpeed: playerState.playbackSpeed,
    error: playerState.error,

    // Computed values
    isPlaying: playerState.status === 'playing',
    isLoading: playerState.status === 'loading' || playerState.status === 'buffering',
    hasError: playerState.status === 'error',
    progress: playerState.duration > 0 ? playerState.position / playerState.duration : 0,

    // Controls
    play: (episode?: Episode) => audioService.play(episode),
    pause: () => audioService.pause(),
    togglePlayPause: () => audioService.togglePlayPause(),
    seekTo: (positionMs: number) => audioService.seekTo(positionMs),
    skipForward: (seconds?: number) => audioService.skipForward(seconds),
    skipBackward: (seconds?: number) => audioService.skipBackward(),
    setPlaybackSpeed: (speed: number) => audioService.setPlaybackSpeed(speed),
    stop: () => audioService.stop(),
  };
}

/**
 * Format time in milliseconds to MM:SS or HH:MM:SS
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
