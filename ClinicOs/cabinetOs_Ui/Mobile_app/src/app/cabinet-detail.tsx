import { ArrowLeft, Building2 } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import { getCabinetDetail } from '@/services/cabinet/cabinet.api';
import type { CabinetDetail, MedecinDetail } from '@/types/cabinet';

export default function CabinetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cabinet, setCabinet] = useState<CabinetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCabinetDetail(id)
      .then(setCabinet)
      .catch(() => setError('Impossible de charger le cabinet.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMedecin = (medecin: MedecinDetail) => {
    router.push(`/medecin-detail?id=${medecin.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={MedosColors.navy} />
        </Pressable>
        <ThemedText style={styles.topTitle}>Cabinet</ThemedText>
      </View>

      {loading ? (
        <ThemedText style={styles.center}>Chargement…</ThemedText>
      ) : error || !cabinet ? (
        <ThemedText style={styles.center}>{error ?? 'Cabinet introuvable'}</ThemedText>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <View style={styles.icon}>
              <Building2 size={28} color={MedosColors.teal} />
            </View>
            <ThemedText style={styles.name}>{cabinet.nom}</ThemedText>
            <ThemedText style={styles.specialite}>{cabinet.specialite}</ThemedText>
            <ThemedText style={styles.ville}>
              {cabinet.ville ?? cabinet.localisation ?? 'Ville non renseignée'}
            </ThemedText>
          </View>

          <ThemedText style={styles.sectionTitle}>
            Médecins ({cabinet.medecins.length})
          </ThemedText>

          <View style={styles.list}>
            {cabinet.medecins.map((medecin) => (
              <Pressable
                key={medecin.id}
                style={styles.medecinCard}
                onPress={() => handleMedecin(medecin)}>
                <View>
                  <ThemedText style={styles.medecinName}>
                    Dr {medecin.prenom} {medecin.nom}
                  </ThemedText>
                  <ThemedText style={styles.medecinSpec}>{medecin.specialite}</ThemedText>
                  <ThemedText style={styles.medecinExp}>
                    {medecin.anneesExperience} ans d'expérience
                  </ThemedText>
                </View>
                <ThemedText style={styles.reserve}>Réserver →</ThemedText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: MedosColors.line,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: MedosColors.frost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontSize: 17, fontWeight: '700', color: MedosColors.navy },
  center: { textAlign: 'center', color: MedosColors.slate, marginTop: 40, padding: 24 },
  content: { padding: 24, gap: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', gap: 8 },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: MedosColors.frost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  name: { fontSize: 22, fontWeight: '800', color: MedosColors.navy, textAlign: 'center' },
  specialite: { fontSize: 14, fontWeight: '600', color: MedosColors.tealDark },
  ville: { fontSize: 13, color: MedosColors.slate },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: MedosColors.navy, marginTop: 8 },
  list: { gap: 12 },
  medecinCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: MedosColors.mist,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedosColors.line,
    padding: 16,
  },
  medecinName: { fontSize: 16, fontWeight: '700', color: MedosColors.ink },
  medecinSpec: { fontSize: 13, color: MedosColors.tealDark, marginTop: 2 },
  medecinExp: { fontSize: 12, color: MedosColors.slate, marginTop: 2 },
  reserve: { fontSize: 13, fontWeight: '700', color: MedosColors.tealDark },
});
