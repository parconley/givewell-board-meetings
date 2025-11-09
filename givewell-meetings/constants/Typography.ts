/**
 * Typography System
 * Calm, precise, modern design
 * Based on 8px spacing grid
 */

import { Platform } from 'react-native';

/**
 * Font families
 * Primary: Inter (or system equivalents)
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
 * Typography scale (mobile)
 */
export const Typography = {
  // Display / Screen title: 28pt, semibold, tight leading
  display: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.2,
  },

  // H1: 24pt, semibold
  h1: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.15,
  },

  // H2: 20pt, semibold
  h2: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.1,
  },

  // H3 / section: 17pt, semibold
  h3: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  // Body: 15-16pt, regular
  body: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 16,
    lineHeight: 24,
  },

  // Body small
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 15,
    lineHeight: 22,
  },

  // Caption / meta: 13pt, regular
  caption: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 13,
    lineHeight: 18,
  },

  // Micro (for very small details)
  micro: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 11,
    lineHeight: 16,
  },
};

/**
 * Spacing scale - 8px base unit
 */
export const Spacing = {
  xs: 4,   // 0.5x
  sm: 8,   // 1x
  md: 12,  // 1.5x
  lg: 16,  // 2x (screen side padding, card internal padding)
  xl: 20,  // 2.5x (card internal padding max)
  xxl: 24, // 3x (section spacing min)
  xxxl: 32, // 4x (section spacing max)
};

/**
 * Border radius values
 */
export const BorderRadius = {
  sm: 8,
  md: 12,   // Input fields
  lg: 16,   // Cards
  full: 999, // Buttons (pill)
};

/**
 * Touch target sizes (minimum 44px for accessibility)
 */
export const TouchTarget = {
  min: 44,
  standard: 48,
  large: 56,
};
