/**
 * Now Playing Screen
 *
 * Audio player interface with controls and show notes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useAudioPlayer, formatTime } from '../../hooks/useAudioPlayer';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, BorderRadius, TouchTarget } from '../../constants/Typography';

const PLAYBACK_SPEEDS = [1.0, 1.25, 1.5, 2.0, 3.0, 4.0, 5.0];

export default function PlayerScreen() {
  const {
    currentEpisode,
    isPlaying,
    isLoading,
    position,
    duration,
    playbackSpeed,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    setPlaybackSpeed,
  } = useAudioPlayer();

  const [expandedAttachment, setExpandedAttachment] = useState<number | null>(null);

  if (!currentEpisode) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No episode playing</Text>
          <Text style={styles.emptySubtext}>Select an episode to start listening</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSpeedPress = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    setPlaybackSpeed(PLAYBACK_SPEEDS[nextIndex]);
  };

  const handleAttachmentPress = (index: number) => {
    setExpandedAttachment(expandedAttachment === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Episode Info */}
        <View style={styles.infoSection}>
          <Text style={styles.meetingNumber}>
            Meeting {currentEpisode.meetingNumber} • {currentEpisode.dateDisplay}
          </Text>
          <Text style={styles.title}>{currentEpisode.title}</Text>
          {currentEpisode.description ? (
            <Text style={styles.description}>{currentEpisode.description}</Text>
          ) : null}
        </View>

        {/* Player Section */}
        <View style={styles.playerSection}>
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

          {/* Main Controls */}
          <View style={styles.controls}>
            {/* Skip Back Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => skipBackward(30)}
            >
              <Text style={styles.skipText}>-30s</Text>
            </TouchableOpacity>

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

            {/* Skip Forward Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => skipForward(30)}
            >
              <Text style={styles.skipText}>+30s</Text>
            </TouchableOpacity>
          </View>

          {/* Playback Speed */}
          <TouchableOpacity
            style={styles.speedButton}
            onPress={handleSpeedPress}
          >
            <Text style={styles.speedText}>{playbackSpeed}×</Text>
          </TouchableOpacity>
        </View>

        {/* Show Notes Section */}
        <View style={styles.showNotesSection}>
          <Text style={styles.showNotesTitle}>Documents</Text>

          <View style={styles.attachmentsList}>
            {currentEpisode.attachments.length === 0 ? (
              <Text style={styles.noAttachmentsText}>No documents available</Text>
            ) : (
              currentEpisode.attachments.map((attachment, index) => (
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
                      <ScrollView style={styles.attachmentTextScroll} nestedScrollEnabled>
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
    padding: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.h2,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textMuted,
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

  // Player Section
  playerSection: {
    marginBottom: Spacing.xxxl,
  },
  seekSection: {
    marginBottom: Spacing.xl,
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
    marginBottom: Spacing.lg,
  },
  controlButton: {
    width: TouchTarget.standard,
    height: TouchTarget.standard,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
  },
  skipText: {
    ...Typography.h3,
    color: Colors.primary,
  },
  playButton: {
    width: TouchTarget.large + 8,
    height: TouchTarget.large + 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
  },
  playButtonText: {
    fontSize: 28,
    color: Colors.background,
  },
  speedButton: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  speedText: {
    ...Typography.h3,
    color: Colors.primary,
  },

  // Show Notes / Documents
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
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
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
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
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
