import { StyleSheet, View } from 'react-native';

import { MedosColors } from '@/constants/theme';

export function MedosHealthHero() {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <View style={styles.circleOuter}>
        <View style={styles.circleInner}>
          <View style={styles.cross}>
            <View style={[styles.crossBar, styles.crossVertical]} />
            <View style={[styles.crossBar, styles.crossHorizontal]} />
          </View>

          <View style={styles.pulseRow}>
            <View style={[styles.pulseSeg, { height: 6 }]} />
            <View style={[styles.pulseSeg, { height: 12 }]} />
            <View style={[styles.pulseSeg, { height: 4 }]} />
            <View style={[styles.pulseSeg, { height: 10 }]} />
          </View>
        </View>
      </View>

      <View style={styles.badgeTop}>
        <View style={styles.badgeDot} />
        <View style={styles.badgeLine} />
      </View>

      <View style={styles.badgeBottom}>
        <View style={styles.badgeDot} />
        <View style={styles.badgeLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: MedosColors.teal,
    opacity: 0.08,
  },
  glowTop: {
    top: -10,
    left: -20,
  },
  glowBottom: {
    bottom: -10,
    right: -20,
    backgroundColor: MedosColors.cyan,
    opacity: 0.1,
  },
  circleOuter: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: MedosColors.mist,
    borderWidth: 2,
    borderColor: MedosColors.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MedosColors.teal,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 6,
  },
  circleInner: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: MedosColors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MedosColors.teal,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6,
  },
  cross: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossBar: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  crossVertical: {
    width: 14,
    height: 52,
  },
  crossHorizontal: {
    width: 52,
    height: 14,
  },
  pulseRow: {
    position: 'absolute',
    bottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pulseSeg: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    opacity: 0.9,
  },
  badgeTop: {
    position: 'absolute',
    top: 26,
    right: 6,
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  badgeBottom: {
    position: 'absolute',
    bottom: 22,
    left: 2,
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MedosColors.cyan,
  },
  badgeLine: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: MedosColors.cyan,
    opacity: 0.5,
  },
});
