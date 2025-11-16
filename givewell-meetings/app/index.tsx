/**
 * Root Index Route
 *
 * Redirects from / to /(tabs) to fix "Unmatched route" error
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)" />;
}
