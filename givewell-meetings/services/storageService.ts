/**
 * Storage Service
 *
 * Handles persistent storage of playback progress and user settings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaybackProgress, StoredData } from '../types/episode';

const STORAGE_KEY = '@givewell_data';

class StorageService {
  /**
   * Load all stored data
   */
  async loadData(): Promise<StoredData> {
    try {
      const dataStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (!dataStr) {
        return this.getDefaultData();
      }

      return JSON.parse(dataStr);
    } catch (error) {
      console.error('Error loading stored data:', error);
      return this.getDefaultData();
    }
  }

  /**
   * Save all data
   */
  async saveData(data: StoredData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  /**
   * Get playback progress for an episode
   */
  async getProgress(episodeId: string): Promise<PlaybackProgress | null> {
    const data = await this.loadData();
    return data.progress[episodeId] || null;
  }

  /**
   * Save playback progress for an episode
   */
  async saveProgress(episodeId: string, position: number, duration: number): Promise<void> {
    const data = await this.loadData();

    // Consider episode completed if within last 30 seconds
    const completed = position >= duration - 30;

    data.progress[episodeId] = {
      episodeId,
      position,
      completed,
      lastPlayed: new Date().toISOString(),
    };

    await this.saveData(data);
  }

  /**
   * Get the last played episode ID
   */
  async getLastEpisodeId(): Promise<string | null> {
    const data = await this.loadData();
    return data.lastEpisodeId;
  }

  /**
   * Set the last played episode
   */
  async setLastEpisodeId(episodeId: string): Promise<void> {
    const data = await this.loadData();
    data.lastEpisodeId = episodeId;
    await this.saveData(data);
  }

  /**
   * Get playback speed setting
   */
  async getPlaybackSpeed(): Promise<number> {
    const data = await this.loadData();
    return data.settings.playbackSpeed;
  }

  /**
   * Save playback speed setting
   */
  async setPlaybackSpeed(speed: number): Promise<void> {
    const data = await this.loadData();
    data.settings.playbackSpeed = speed;
    await this.saveData(data);
  }

  /**
   * Mark episode as completed
   */
  async markCompleted(episodeId: string, duration: number): Promise<void> {
    const data = await this.loadData();
    data.progress[episodeId] = {
      episodeId,
      position: duration,
      completed: true,
      lastPlayed: new Date().toISOString(),
    };
    await this.saveData(data);
  }

  /**
   * Get all progress entries
   */
  async getAllProgress(): Promise<Record<string, PlaybackProgress>> {
    const data = await this.loadData();
    return data.progress;
  }

  /**
   * Clear all data (for debugging/testing)
   */
  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get default/empty data structure
   */
  private getDefaultData(): StoredData {
    return {
      lastEpisodeId: null,
      progress: {},
      settings: {
        playbackSpeed: 1.0,
      },
    };
  }
}

// Export singleton instance
export const storageService = new StorageService();
