/**
 * TypeScript types for GiveWell Board Meetings app
 */

export interface Attachment {
  filename: string;
  type: 'agenda' | 'minutes' | 'attachment' | 'document';
  label: string;
  title: string;
}

export interface Episode {
  id: string;
  meetingNumber: number;
  title: string;
  date: string; // ISO format: "2007-06-22"
  dateDisplay: string; // Human-readable: "June 22, 2007"
  audioFilename: string;
  duration: number; // seconds
  durationDisplay: string; // "1h 50m"
  fileSize: number; // bytes
  fileSizeDisplay: string; // "134 MB"
  description: string;
  attachments: Attachment[];
}

export interface EpisodesData {
  metadata: {
    generatedAt: string;
    totalEpisodes: number;
    source: string;
  };
  episodes: Episode[];
}

/**
 * Playback progress tracking
 */
export interface PlaybackProgress {
  episodeId: string;
  position: number; // seconds
  completed: boolean;
  lastPlayed: string; // ISO timestamp
}

/**
 * Player state
 */
export interface PlayerState {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number; // current position in seconds
  duration: number; // total duration in seconds
  playbackSpeed: number; // 1.0, 1.25, 1.5, 2.0
  error: string | null;
}

/**
 * Storage structure for persisted data
 */
export interface StoredData {
  lastEpisodeId: string | null;
  progress: Record<string, PlaybackProgress>; // episodeId -> progress
  settings: {
    playbackSpeed: number;
  };
}
