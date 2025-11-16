/**
 * Individual Episode Page
 *
 * Dedicated page for each episode with audio player and documents
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useAudioPlayer, formatTime } from '../../hooks/useAudioPlayer';
import { Episode } from '../../types/episode';
import { episodesService } from '../../services/episodesService';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, BorderRadius, TouchTarget } from '../../constants/Typography';

const PLAYBACK_SPEEDS = [1.0, 1.25, 1.5, 2.0, 3.0, 4.0, 5.0];

export default function EpisodePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedAttachment, setExpandedAttachment] = useState<number | null>(null);

  const {
    currentEpisode,
    isPlaying,
    isLoading,
    position,
    duration,
    playbackSpeed,
    error,
    play,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    setPlaybackSpeed,
  } = useAudioPlayer();

  useEffect(() => {
    loadEpisode();
  }, [id]);

  const loadEpisode = async () => {
    try {
      setLoading(true);
      const ep = await episodesService.getEpisodeById(id as string);
      setEpisode(ep || null);

      // Auto-play this episode if it's not already playing
      if (ep && (!currentEpisode || currentEpisode.id !== ep.id)) {
        await play(ep);
      }
    } catch (err) {
      console.error('Error loading episode:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeedPress = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    setPlaybackSpeed(PLAYBACK_SPEEDS[nextIndex]);
  };

  const handleAttachmentPress = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedAttachment(expandedAttachment === index ? null : index);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyText}>Loading episode...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!episode) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Episode not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>← Back to Episodes</Text>
        </TouchableOpacity>

        {/* Episode Info */}
        <View style={styles.infoSection}>
          <Text style={styles.meetingNumber}>
            Meeting {episode.meetingNumber} • {episode.dateDisplay}
          </Text>
          <Text style={styles.title}>{episode.title}</Text>
          {episode.description ? (
            <Text style={styles.description}>{episode.description}</Text>
          ) : null}
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Player Section */}
        <View style={styles.playerSection}>
          {/* Play/Pause Button */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            disabled={isLoading}
          >
            <Text style={styles.playButtonText}>
              {isLoading ? '...' : isPlaying ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>

          {/* Seek Bar */}
          <View style={styles.seekSection}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={(value) => seekTo(value)}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.seekBarTrack}
              thumbTintColor={Colors.accent}
            />
            <View style={styles.timeLabels}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Skip Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => skipBackward(15)}
            >
              <Text style={styles.skipText}>-15s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.speedButton}
              onPress={handleSpeedPress}
            >
              <Text style={styles.speedText}>{playbackSpeed}×</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => skipForward(15)}
            >
              <Text style={styles.skipText}>+15s</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.showNotesSection}>
          <Text style={styles.showNotesTitle}>Documents</Text>

          <View style={styles.attachmentsList}>
            {episode.attachments.length === 0 ? (
              <Text style={styles.noAttachmentsText}>No documents available</Text>
            ) : (
              episode.attachments.map((attachment, index) => (
                <View key={index} style={styles.attachmentContainer}>
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    onPress={() => handleAttachmentPress(index)}
                  >
                    <Text style={styles.attachmentIcon}>📄</Text>
                    <View style={styles.attachmentTextContainer}>
                      <Text style={styles.attachmentLabel}>{attachment.label}</Text>
                      {attachment.title !== attachment.label && (
                        <Text style={styles.attachmentTitle}>{attachment.title}</Text>
                      )}
                    </View>
                    <Text style={styles.attachmentToggle}>
                      {expandedAttachment === index ? '▼' : '▶'}
                    </Text>
                  </TouchableOpacity>

                  {expandedAttachment === index && attachment.text && (
                    <View style={styles.attachmentContent}>
                      <ScrollView
                        style={styles.attachmentTextScroll}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={true}
                      >
                        <Text style={styles.attachmentTextContent}>{attachment.text}</Text>
                      </ScrollView>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl * 2,
  },
  emptyText: {
    ...Typography.h2,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
  backButtonContainer: {
    marginBottom: Spacing.md,
  },
  backButton: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Episode Info
  infoSection: {
    marginBottom: Spacing.xxxl,
  },
  meetingNumber: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.textMuted,
    lineHeight: 22,
  },

  // Error
  errorContainer: {
    backgroundColor: '#fee',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },

  // Player Section
  playerSection: {
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  playButton: {
    width: TouchTarget.large + 16,
    height: TouchTarget.large + 16,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonText: {
    fontSize: 32,
    color: Colors.background,
  },
  seekSection: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  controlButton: {
    width: TouchTarget.standard,
    height: TouchTarget.standard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    ...Typography.h3,
    color: Colors.primary,
  },
  speedButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  speedText: {
    ...Typography.h3,
    color: Colors.primary,
  },

  // Documents
  showNotesSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.lg,
  },
  showNotesTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  attachmentsList: {
    marginTop: Spacing.sm,
  },
  attachmentContainer: {
    marginBottom: Spacing.md,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  attachmentTextContainer: {
    flex: 1,
  },
  attachmentLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  attachmentTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  attachmentToggle: {
    ...Typography.h3,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  attachmentContent: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  attachmentTextScroll: {
    maxHeight: 300,
  },
  attachmentTextContent: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  noAttachmentsText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
