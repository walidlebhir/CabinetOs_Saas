import { MapPin, Search as SearchIcon, SearchX } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { CabinetCard } from '@/components/cabinet/cabinet-card';
import { Screen } from '@/components/ui/screen';
import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import { useCabinets } from '@/hooks/use-cabinets';
import type { CabinetHome } from '@/types/cabinet';

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function haystack(cabinet: CabinetHome): string {
  return normalizeText(
    [cabinet.nom, cabinet.specialite, cabinet.ville ?? '', cabinet.localisation ?? ''].join(' ')
  );
}

function hasCoords(
  c: CabinetHome
): c is CabinetHome & { latitude: number; longitude: number } {
  return c.latitude !== null && c.longitude !== undefined && c.longitude !== null;
}

export default function SearchScreen() {
  const { cabinets, loading, refreshing, error, reload } = useCabinets();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const normalizedQuery = normalizeText(query.trim());
  const filtered = useMemo(() => {
    if (normalizedQuery === '') return cabinets;
    return cabinets.filter((c) => haystack(c).includes(normalizedQuery));
  }, [cabinets, normalizedQuery]);

  const locatedPoints = useMemo(() => filtered.filter(hasCoords), [filtered]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const next = normalizeText(value.trim());
    if (next === '') {
      setSelectedId(null);
      return;
    }
    const found = cabinets.filter((c) => haystack(c).includes(next));
    const firstLocated = found.find(hasCoords);
    setSelectedId(firstLocated ? firstLocated.id : null);
  };

  const handleSelect = (cabinet: CabinetHome) => {
    if (!hasCoords(cabinet)) return;
    setSelectedId(cabinet.id);
  };

  const selectedPoint = locatedPoints.find((p) => p.id === selectedId);
  const region = selectedPoint
    ? {
        latitude: selectedPoint.latitude,
        longitude: selectedPoint.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : undefined;

  return (
    <Screen title="Recherche" subtitle="Trouvez un cabinet par nom, ville ou spécialité">
      <View style={styles.searchBox}>
        <SearchIcon size={18} color={MedosColors.slate} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un cabinet…"
          placeholderTextColor={MedosColors.slate}
          value={query}
          onChangeText={handleQueryChange}
        />
        {query ? (
          <Pressable onPress={() => handleQueryChange('')} hitSlop={10}>
            <SearchX size={18} color={MedosColors.slate} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />
        }>
        {loading && cabinets.length === 0 ? (
          <ThemedText style={styles.center}>Chargement…</ThemedText>
        ) : error && cabinets.length === 0 ? (
          <ThemedText style={styles.center}>{error}</ThemedText>
        ) : (
          <>
            <View style={styles.mapContainer}>
              {locatedPoints.length > 0 ? (
                <MapView style={styles.map} region={region} initialRegion={region}>
                  {locatedPoints.map((point) => (
                    <Marker
                      key={point.id}
                      coordinate={{
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }}
                      title={point.nom}
                      description={point.specialite}
                      onPress={() => setSelectedId(point.id)}
                      pinColor={point.id === selectedId ? MedosColors.teal : MedosColors.cyan}
                    />
                  ))}
                </MapView>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <MapPin size={26} color={MedosColors.teal} />
                  <ThemedText style={styles.mapPlaceholderText}>
                    Aucun cabinet géolocalisé
                  </ThemedText>
                </View>
              )}
            </View>

            <ThemedText style={styles.count}>
              {normalizedQuery === ''
                ? `${filtered.length} cabinet${filtered.length > 1 ? 's' : ''}`
                : `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}`}
            </ThemedText>

            <View style={styles.list}>
              {filtered.length === 0 ? (
                <ThemedText style={styles.center}>
                  Aucun cabinet ne correspond à « {query.trim()} ».
                </ThemedText>
              ) : (
                filtered.map((cabinet) => (
                  <Pressable key={cabinet.id} onPress={() => handleSelect(cabinet)}>
                    <CabinetCard cabinet={cabinet} selected={selectedId === cabinet.id} />
                  </Pressable>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 24,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: MedosColors.line,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: MedosColors.ink,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 8, gap: 12 },
  mapContainer: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MedosColors.line,
  },
  map: { flex: 1 },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: MedosColors.frost,
  },
  mapPlaceholderText: { color: MedosColors.slate, fontSize: 13 },
  count: { fontSize: 13, fontWeight: '700', color: MedosColors.navy },
  list: { gap: 12 },
  center: { textAlign: 'center', color: MedosColors.slate, marginTop: 24 },
});
