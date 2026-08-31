import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';

type ScreenProps = ViewProps & {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Screen({ title, subtitle, children, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={[styles.content, style]}>
        {title ? (
          <View style={styles.header}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {subtitle ? (
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            ) : null}
          </View>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: MedosColors.navy,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: MedosColors.slate,
  },
});
