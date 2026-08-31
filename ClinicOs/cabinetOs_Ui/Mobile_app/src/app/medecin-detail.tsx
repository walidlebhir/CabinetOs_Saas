import { ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedosButton } from '@/components/medos-button';
import { MedosTextInput } from '@/components/medos-text-input';
import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/api';
import { getMedecinProfil } from '@/services/medecin/medecin.api';
import { getMyPatientInfo } from '@/services/patient/patient.api';
import { createRendezvous } from '@/services/rendezvous/rendezvous.api';
import type { MedecinProfilDetail } from '@/types/cabinet';

export default function MedecinDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [medecin, setMedecin] = useState<MedecinProfilDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [motif, setMotif] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getMedecinProfil(id)
      .then(setMedecin)
      .catch(() => setError('Impossible de charger le médecin.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!medecin) return;
    if (!date.trim() || !heure.trim()) {
      Alert.alert('Champs requis', 'Renseignez le date (AAAA-MM-JJ) et l’heure (HH:MM).');
      return;
    }
    setSubmitting(true);
    try {
      const patient = await getMyPatientInfo();
      await createRendezvous({
        id_patient: patient.id,
        id_medecin: medecin.id,
        date_rendezvous: date.trim(),
        heur_debut: heure.trim(),
        heur_fin: '',
        motif: motif.trim() || undefined,
      });
      Alert.alert('Réservé !', 'Votre rendez-vous a bien été enregistré.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Réservation impossible', getApiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={MedosColors.navy} />
        </Pressable>
        <ThemedText style={styles.topTitle}>Prendre rendez-vous</ThemedText>
      </View>

      {loading ? (
        <ThemedText style={styles.center}>Chargement…</ThemedText>
      ) : error || !medecin ? (
        <ThemedText style={styles.center}>{error ?? 'Médecin introuvable'}</ThemedText>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <ThemedText style={styles.name}>
              Dr {medecin.prenom} {medecin.nom}
            </ThemedText>
            <ThemedText style={styles.spec}>{medecin.specialite}</ThemedText>
            <ThemedText style={styles.exp}>{medecin.anneesExperience} ans d'expérience</ThemedText>
          </View>

          {medecin.disponibilites.length > 0 ? (
            <View style={styles.dispo}>
              <ThemedText style={styles.dispoTitle}>Disponibilités</ThemedText>
              {medecin.disponibilites.map((d) => (
                <View key={d.id} style={styles.dispoRow}>
                  <ThemedText style={styles.dispoDay}>{d.joursemaine}</ThemedText>
                  <ThemedText style={styles.dispoTime}>
                    {d.heurDebut} – {d.heurFin}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.form}>
            <MedosTextInput
              label="Date (AAAA-MM-JJ)"
              placeholder="2026-09-01"
              value={date}
              onChangeText={setDate}
            />
            <MedosTextInput
              label="Heure de début (HH:MM)"
              placeholder="09:00"
              value={heure}
              onChangeText={setHeure}
            />
            <MedosTextInput
              label="Motif (optionnel)"
              placeholder="Consultation générale"
              value={motif}
              onChangeText={setMotif}
            />
            <MedosButton title="Confirmer la réservation" onPress={handleBook} loading={submitting} />
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
  content: { padding: 24, gap: 24, paddingBottom: 40 },
  hero: { alignItems: 'center', gap: 6 },
  name: { fontSize: 22, fontWeight: '800', color: MedosColors.navy, textAlign: 'center' },
  spec: { fontSize: 14, fontWeight: '600', color: MedosColors.tealDark },
  exp: { fontSize: 13, color: MedosColors.slate },
  dispo: { gap: 10 },
  dispoTitle: { fontSize: 15, fontWeight: '700', color: MedosColors.navy },
  dispoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: MedosColors.mist,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedosColors.line,
    padding: 14,
  },
  dispoDay: { fontSize: 14, fontWeight: '600', color: MedosColors.ink },
  dispoTime: { fontSize: 14, color: MedosColors.tealDark },
  form: { gap: 16 },
});
