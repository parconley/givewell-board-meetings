/**
 * Root Layout
 *
 * Main app layout and initialization
 */

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { audioService } from '../services/audioService';

export default function RootLayout() {
  useEffect(() => {
    // Resume last episode on app launch if desired
    // audioService.resumeLastEpisode().catch(console.error);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
