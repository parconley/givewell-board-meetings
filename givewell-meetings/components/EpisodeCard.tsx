/**
 * Episode Card Component
 *
 * Displays a single episode in the episodes list
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Episode, PlaybackProgress } from '../types/episode';
import { Colors } from '../constants/Colors';
import { Typography, Spacing, BorderRadius } from '../constants/Typography';

interface EpisodeCardProps {
  episode: Episode;
  progress?: PlaybackProgress | null;
  onPress: () => void;
  isCurrentlyPlaying?: boolean;
}

export function EpisodeCard({ episode, progress, onPress, isCurrentlyPlaying }: EpisodeCardProps) {
  // Calculate progress percentage
  const progressPercent = progress && !progress.completed
    ? (progress.position / episode.duration) * 100
    : progress?.completed
    ? 100
    : 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCurrentlyPlaying && styles.containerPlaying,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header: Meeting number and date */}
      <View style={styles.header}>
        <Text style={styles.meetingNumber}>Meeting {episode.meetingNumber}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.date}>{episode.dateDisplay}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {episode.title}
      </Text>

      {/* Description */}
      {episode.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {episode.description}
        </Text>
      ) : null}

      {/* Footer: Duration and file size */}
      <View style={styles.footer}>
        <Text style={styles.meta}>{episode.durationDisplay}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.meta}>{episode.fileSizeDisplay}</Text>
        {progress?.completed && (
          <>
            <Text style={styles.dot}>•</Text>
            <Text style={[styles.meta, styles.completed]}>Completed</Text>
          </>
        )}
      </View>

      {/* Progress bar */}
      {progressPercent > 0 && progressPercent < 100 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  containerPlaying: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  meetingNumber: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  dot: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginHorizontal: Spacing.xs,
  },
  date: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  completed: {
    color: Colors.primary,
  },
  progressContainer: {
    height: 3,
    backgroundColor: Colors.seekBarTrack,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
});
