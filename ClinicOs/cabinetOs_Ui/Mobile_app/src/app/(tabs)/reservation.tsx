import { Calendar } from 'lucide-react-native';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { RendezvousStatusBadge, formatDate } from '@/components/reservation/rendezvous-status';
import { Screen } from '@/components/ui/screen';
import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import { useRendezvous } from '@/hooks/use-rendezvous';
import type { Rendezvous } from '@/types/rendezvous';

export default function ReservationScreen() {
  const { rendezvous, loading, refreshing, error, reload } = useRendezvous();

  return (
    <Screen title="Réservations" subtitle="Vos rendez-vous médicaux">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => reload(true)} />
        }>
        {loading && rendezvous.length === 0 ? (
          <ThemedText style={styles.center}>Chargement…</ThemedText>
        ) : error && rendezvous.length === 0 ? (
          <ThemedText style={styles.center}>{error}</ThemedText>
        ) : (
          <View style={styles.list}>
            {rendezvous.length === 0 ? (
              <View style={styles.empty}>
                <Calendar size={30} color={MedosColors.teal} />
                <ThemedText style={styles.emptyTitle}>Aucun rendez-vous</ThemedText>
                <ThemedText style={styles.emptyText}>
                  Réservez une consultation auprès de votre médecin.
                </ThemedText>
              </View>
            ) : (
              rendezvous.map((rdv: Rendezvous) => (
                <View key={rdv.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.medecin}>{rdv.nomMedecin}</ThemedText>
                    <RendezvousStatusBadge status={rdv.status} />
                  </View>
                  <View style={styles.cardBody}>
                    <ThemedText style={styles.date}>{formatDate(rdv.dateRendezvous)}</ThemedText>
                    <ThemedText style={styles.time}>
                      {rdv.heureDebut} – {rdv.heureFin}
                    </ThemedText>
                  </View>
                  {rdv.motif ? (
                    <ThemedText style={styles.motif}>Motif : {rdv.motif}</ThemedText>
                  ) : null}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 8, paddingBottom: 40 },
  list: { gap: 12 },
  center: { textAlign: 'center', color: MedosColors.slate, marginTop: 40 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedosColors.line,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medecin: { fontSize: 16, fontWeight: '700', color: MedosColors.navy },
  cardBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  date: { fontSize: 14, fontWeight: '600', color: MedosColors.ink },
  time: { fontSize: 13, color: MedosColors.tealDark },
  motif: { fontSize: 13, color: MedosColors.slate },
  empty: { alignItems: 'center', gap: 8, marginTop: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: MedosColors.navy },
  emptyText: { fontSize: 14, color: MedosColors.slate, textAlign: 'center' },
});
