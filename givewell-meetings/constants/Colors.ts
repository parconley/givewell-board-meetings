/**
 * GiveWell Brand Colors
 *
 * Color palette inspired by GiveWell's visual identity:
 * - Primary blue for main actions and highlights
 * - Gold accent for progress indicators
 * - Neutral grays for backgrounds and text
 */

export const Colors = {
  // Primary brand colors
  primary: '#1F88D6',        // GiveWell blue - main brand color
  accent: '#FDB913',         // Gold accent - for progress bars and highlights

  // Backgrounds
  background: '#FFFFFF',     // Main app background
  cardBg: '#F5F7FA',         // Card backgrounds

  // Borders and dividers
  border: '#D3D8E0',         // Subtle borders

  // Text colors
  textPrimary: '#1F2933',    // Main text color
  textMuted: '#6B7280',      // Secondary/muted text

  // UI states
  disabled: '#CBD5E0',       // Disabled state
  error: '#DC2626',          // Error messages

  // Audio player specific
  seekBarTrack: '#E5E7EB',   // Seek bar background
  seekBarProgress: '#1F88D6', // Seek bar progress (blue)
  seekBarHandle: '#FDB913',  // Seek bar handle (gold)
};

/**
 * Semantic color aliases for specific use cases
 */
export const SemanticColors = {
  buttonPrimary: Colors.primary,
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#FFFFFF',
  buttonSecondaryBorder: Colors.primary,
  buttonSecondaryText: Colors.primary,

  cardBackground: Colors.cardBg,
  cardBorder: Colors.border,

  progressBar: Colors.accent,
  progressBarBackground: Colors.seekBarTrack,
};
