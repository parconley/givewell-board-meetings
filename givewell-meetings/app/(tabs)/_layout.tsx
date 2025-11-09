/**
 * Tab Layout
 *
 * Sets up the tab navigation between Episodes and Player screens
 */

import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          ...Typography.caption,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Episodes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📚</Text>,
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Now Playing',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>▶️</Text>,
        }}
      />
    </Tabs>
  );
}
