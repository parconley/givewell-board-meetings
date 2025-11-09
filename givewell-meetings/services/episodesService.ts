/**
 * Episodes Data Service
 *
 * Handles fetching and caching episode metadata.
 * Data is fetched from GitHub and cached locally.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Episode, EpisodesData } from '../types/episode';

// Development mode: load from local file
// Production mode: load from GitHub
const USE_LOCAL_DATA = __DEV__; // Set to false when GitHub repo is ready

// TODO: Update this URL once GitHub repo is set up
const EPISODES_JSON_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/givewell-board-meetings-app/main/data/episodes.json';

// Local development data
const LOCAL_EPISODES_DATA = require('../episodes.json') as EpisodesData;

const CACHE_KEY = '@givewell_episodes';
const CACHE_TIMESTAMP_KEY = '@givewell_episodes_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class EpisodesService {
  private episodes: Episode[] = [];
  private isInitialized: boolean = false;

  /**
   * Initialize the service by loading episodes
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Try to load from cache first
      const cached = await this.loadFromCache();
      if (cached) {
        this.episodes = cached;
        this.isInitialized = true;
        // Fetch updates in the background
        this.fetchAndUpdate().catch(console.error);
        return;
      }

      // No cache, fetch from remote
      await this.fetchAndUpdate();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize episodes service:', error);
      throw error;
    }
  }

  /**
   * Fetch episodes from remote and update cache
   */
  async fetchAndUpdate(): Promise<Episode[]> {
    try {
      // In development mode, use local data
      if (USE_LOCAL_DATA) {
        console.log('Loading episodes from local file (development mode)');
        this.episodes = LOCAL_EPISODES_DATA.episodes;
        await this.saveToCache(this.episodes);
        return this.episodes;
      }

      // Production mode: fetch from GitHub
      console.log('Fetching episodes from:', EPISODES_JSON_URL);
      const response = await fetch(EPISODES_JSON_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EpisodesData = await response.json();
      this.episodes = data.episodes;

      // Cache the data
      await this.saveToCache(this.episodes);

      return this.episodes;
    } catch (error) {
      console.error('Failed to fetch episodes:', error);
      throw error;
    }
  }

  /**
   * Get all episodes
   */
  async getEpisodes(): Promise<Episode[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.episodes;
  }

  /**
   * Get a specific episode by ID
   */
  async getEpisodeById(id: string): Promise<Episode | undefined> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.episodes.find(ep => ep.id === id);
  }

  /**
   * Get episode by meeting number
   */
  async getEpisodeByNumber(number: number): Promise<Episode | undefined> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.episodes.find(ep => ep.meetingNumber === number);
  }

  /**
   * Get audio URL for an episode
   * Constructs the full URL to the audio file on GitHub
   */
  getAudioUrl(episode: Episode): string {
    const baseUrl = 'https://raw.githubusercontent.com/YOUR_USERNAME/givewell-board-meetings-app/main/audio';
    return `${baseUrl}/${episode.id}_${episode.audioFilename}`;
  }

  /**
   * Get document URL for an attachment
   */
  getDocumentUrl(episode: Episode, filename: string): string {
    const baseUrl = 'https://raw.githubusercontent.com/YOUR_USERNAME/givewell-board-meetings-app/main/documents';
    return `${baseUrl}/${episode.id}/${filename}`;
  }

  /**
   * Load episodes from cache
   */
  private async loadFromCache(): Promise<Episode[] | null> {
    try {
      const [cachedData, timestamp] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEY),
        AsyncStorage.getItem(CACHE_TIMESTAMP_KEY),
      ]);

      if (!cachedData || !timestamp) {
        return null;
      }

      // Check if cache is still valid
      const cacheAge = Date.now() - parseInt(timestamp, 10);
      if (cacheAge > CACHE_DURATION) {
        console.log('Cache expired, will fetch fresh data');
        return null;
      }

      const episodes: Episode[] = JSON.parse(cachedData);
      console.log(`Loaded ${episodes.length} episodes from cache`);
      return episodes;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
    }
  }

  /**
   * Save episodes to cache
   */
  private async saveToCache(episodes: Episode[]): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify(episodes)),
        AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString()),
      ]);
      console.log(`Cached ${episodes.length} episodes`);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  /**
   * Clear cache (useful for debugging or manual refresh)
   */
  async clearCache(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(CACHE_KEY),
      AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY),
    ]);
    this.isInitialized = false;
    this.episodes = [];
  }
}

// Export singleton instance
export const episodesService = new EpisodesService();
