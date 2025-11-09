/**
 * Episodes List Screen
 *
 * Main screen showing all available episodes
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EpisodeCard } from '../../components/EpisodeCard';
import { useEpisodes } from '../../hooks/useEpisodes';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { Episode } from '../../types/episode';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing } from '../../constants/Typography';

export default function EpisodesScreen() {
  const router = useRouter();
  const { episodes, loading, error, refreshEpisodes, getEpisodeProgress } = useEpisodes();
  const { currentEpisode, play } = useAudioPlayer();

  const handleEpisodePress = async (episode: Episode) => {
    // Start playing the episode
    await play(episode);
    // Navigate to player screen
    router.push('/(tabs)/player');
  };

  const renderEpisode = ({ item }: { item: Episode }) => (
    <EpisodeCard
      episode={item}
      progress={getEpisodeProgress(item.id)}
      onPress={() => handleEpisodePress(item)}
      isCurrentlyPlaying={currentEpisode?.id === item.id}
    />
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyText}>Loading episodes...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.emptySubtext}>Pull down to retry</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No episodes found</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GiveWell Board Meetings</Text>
        <Text style={styles.headerSubtitle}>
          {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Episodes List */}
      <FlatList
        data={episodes}
        renderItem={renderEpisode}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshEpisodes}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
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
  emptySubtext: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  errorText: {
    ...Typography.h2,
    color: Colors.error,
  },
});
