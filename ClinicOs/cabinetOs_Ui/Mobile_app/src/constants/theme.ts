/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const MedosColors = {
  navy: '#063b5c',
  navyDeep: '#04293f',
  teal: '#08a6b5',
  tealDark: '#067f8b',
  cyan: '#19b8c5',
  mist: '#f5fafc',
  frost: '#eef8fa',
  ink: '#123047',
  slate: '#667085',
  line: '#dcecef',
} as const;

export const Colors = {
  light: {
    text: MedosColors.ink,
    background: '#ffffff',
    backgroundElement: MedosColors.mist,
    backgroundSelected: MedosColors.frost,
    textSecondary: MedosColors.slate,
  },
  dark: {
    text: '#ffffff',
    background: MedosColors.navyDeep,
    backgroundElement: MedosColors.navy,
    backgroundSelected: '#0a4a6b',
    textSecondary: '#B0C4CE',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
