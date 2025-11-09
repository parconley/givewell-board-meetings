/**
 * GiveWell Typography System
 *
 * Clean, minimal typography using system fonts:
 * - iOS: SF Pro
 * - Android: Roboto
 */

import { Platform } from 'react-native';

/**
 * Font families
 */
export const FontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  semiBold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

/**
 * Font weights
 */
export const FontWeight = {
  regular: '400' as const,
  semiBold: '600' as const,
};

/**
 * Typography styles for different text elements
 */
export const Typography = {
  // Page titles
  h1: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 0.2,
  },

  // Section headers, episode titles
  h2: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
  },

  // Card titles, button text
  h3: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  // Body text, descriptions
  body: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 15,
    lineHeight: 22,
  },

  // Small body text
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  // Captions, metadata, timestamps
  caption: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 13,
    lineHeight: 18,
  },

  // Very small text (file sizes, etc.)
  micro: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 11,
    lineHeight: 16,
  },
};

/**
 * Spacing scale for consistent vertical rhythm
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Border radius values
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

/**
 * Touch target sizes (minimum 44px for accessibility)
 */
export const TouchTarget = {
  min: 44,
  standard: 48,
  large: 56,
};
