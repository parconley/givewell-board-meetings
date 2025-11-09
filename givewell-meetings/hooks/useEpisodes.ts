/**
 * Episodes Hook
 *
 * Hook for loading and managing episodes data
 */

import { useEffect, useState } from 'react';
import { Episode } from '../types/episode';
import { episodesService } from '../services/episodesService';
import { storageService } from '../services/storageService';
import { PlaybackProgress } from '../types/episode';

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, PlaybackProgress>>({});

  useEffect(() => {
    loadEpisodes();
  }, []);

  const loadEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);

      const [episodesData, progressData] = await Promise.all([
        episodesService.getEpisodes(),
        storageService.getAllProgress(),
      ]);

      setEpisodes(episodesData);
      setProgress(progressData);
    } catch (err) {
      console.error('Error loading episodes:', err);
      setError('Failed to load episodes');
    } finally {
      setLoading(false);
    }
  };

  const refreshEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);

      await episodesService.fetchAndUpdate();
      const [episodesData, progressData] = await Promise.all([
        episodesService.getEpisodes(),
        storageService.getAllProgress(),
      ]);

      setEpisodes(episodesData);
      setProgress(progressData);
    } catch (err) {
      console.error('Error refreshing episodes:', err);
      setError('Failed to refresh episodes');
    } finally {
      setLoading(false);
    }
  };

  const getEpisodeProgress = (episodeId: string): PlaybackProgress | null => {
    return progress[episodeId] || null;
  };

  return {
    episodes,
    loading,
    error,
    refreshEpisodes,
    getEpisodeProgress,
  };
}
