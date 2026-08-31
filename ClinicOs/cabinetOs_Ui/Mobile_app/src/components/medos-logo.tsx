import { StyleSheet, Text, View } from 'react-native';

import { MedosColors } from '@/constants/theme';

type MedosLogoProps = {
  dark?: boolean;
  centered?: boolean;
};

export function MedosLogo({ dark = false, centered = false }: MedosLogoProps) {
  return (
    <View style={[styles.container, centered && styles.centered]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>M</Text>
      </View>
      <Text style={[styles.wordmark, dark ? styles.wordmarkDark : styles.wordmarkLight]}>
        Med<Text style={styles.wordmarkAccent}>OS</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  centered: {
    justifyContent: 'center',
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: MedosColors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MedosColors.teal,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  badgeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  wordmarkLight: {
    color: MedosColors.navy,
  },
  wordmarkDark: {
    color: '#ffffff',
  },
  wordmarkAccent: {
    color: MedosColors.teal,
  },
});
