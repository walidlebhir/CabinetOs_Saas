import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { CabinetCard } from '@/components/cabinet/cabinet-card';
import { Screen } from '@/components/ui/screen';
import { ThemedText } from '@/components/themed-text';
import { useCabinets } from '@/hooks/use-cabinets';
import { MedosColors } from '@/constants/theme';
import type { CabinetHome } from '@/types/cabinet';

export default function AccueilScreen() {
  const router = useRouter();
  const { cabinets, loading, refreshing, error, reload } = useCabinets();

  const handlePress = (cabinet: CabinetHome) => {
    router.push(`/cabinet-detail?id=${cabinet.id}`);
  };

  return (
    <Screen title="Cabinets" subtitle="Explorez les cabinets médicaux disponibles">
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              reload(true);
            }}
          />
        }>
        {loading && cabinets.length === 0 ? (
          <ThemedText style={styles.center}>Chargement…</ThemedText>
        ) : error && cabinets.length === 0 ? (
          <ThemedText style={styles.center}>{error}</ThemedText>
        ) : (
          <View style={styles.list}>
            {cabinets.map((cabinet) => (
              <Pressable key={cabinet.id} onPress={() => handlePress(cabinet)}>
                <CabinetCard cabinet={cabinet} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 16,
    paddingTop: 8,
  },
  list: {
    gap: 12,
  },
  center: {
    textAlign: 'center',
    color: MedosColors.slate,
    marginTop: 40,
  },
});
