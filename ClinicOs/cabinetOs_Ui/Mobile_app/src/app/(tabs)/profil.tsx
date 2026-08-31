import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedosButton } from '@/components/medos-button';
import { MedosLogo } from '@/components/medos-logo';
import { MedosTextInput } from '@/components/medos-text-input';
import { Screen } from '@/components/ui/screen';
import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/api';
import { addPatientInfo, getMyPatientInfo } from '@/services/patient/patient.api';
import { useAuthStore } from '@/store/auth-store';
import type { Sex } from '@/types/patient';

export default function ProfilScreen() {
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);

  const [patient, setPatient] = useState<{
    name: string;
    date_naissance: string | null;
    sex: Sex | null;
    groupe_sanguin: string | null;
    ville: string | null;
    adresse: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sex, setSex] = useState('');
  const [naissance, setNaissance] = useState('');
  const [groupe, setGroupe] = useState('');
  const [ville, setVille] = useState('');
  const [adresse, setAdresse] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const info = await getMyPatientInfo();
      setPatient({
        name: info.name,
        date_naissance: info.date_naissance,
        sex: info.sex,
        groupe_sanguin: info.groupe_sanguin,
        ville: info.ville,
        adresse: info.adresse,
      });
    } catch (e) {
      setError((e as Error).message ?? null);
      setPatient(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!sex.trim() || !naissance.trim() || !groupe.trim() || !ville.trim() || !adresse.trim()) {
      Alert.alert('Champs requis', 'Renseignez sexe, date de naissance, groupe sanguin, ville et adresse.');
      return;
    }
    const sexValue = sex.trim().toUpperCase() as Sex;
    if (sexValue !== 'HOMME' && sexValue !== 'FEMME') {
      Alert.alert('Erreur', 'Le sexe doit être HOMME ou FEMME.');
      return;
    }
    setSaving(true);
    try {
      await addPatientInfo({
        date_naissance: naissance.trim(),
        sex: sexValue,
        groupe_sanguin: groupe.trim(),
        ville: ville.trim(),
        adresse: adresse.trim(),
      });
      Alert.alert('Enregistré', 'Votre profil a été complété.');
      load();
    } catch (e) {
      Alert.alert('Erreur', getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <MedosLogo />
        <MedosButton title="Déconnexion" variant="ghost" onPress={handleLogout} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}>
        <ThemedText style={styles.title}>Mon profil</ThemedText>
        <ThemedText style={styles.subtitle}>{email ?? ''}</ThemedText>

        {loading ? (
          <ThemedText style={styles.center}>Chargement…</ThemedText>
        ) : patient ? (
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoName}>{patient.name}</ThemedText>
            <InfoRow label="Date de naissance" value={patient.date_naissance ?? '—'} />
            <InfoRow label="Sexe" value={patient.sex ?? '—'} />
            <InfoRow label="Groupe sanguin" value={patient.groupe_sanguin ?? '—'} />
            <InfoRow label="Ville" value={patient.ville ?? '—'} />
            <InfoRow label="Adresse" value={patient.adresse ?? '—'} />
          </View>
        ) : (
          <View style={styles.completeForm}>
            <ThemedText style={styles.formTitle}>
              {error ? 'Complétez votre profil' : 'Votre profil est incomplet'}
            </ThemedText>
            <ThemedText style={styles.formHint}>
              Renseignez ces informations médicales pour finaliser votre compte patient.
            </ThemedText>
            <MedosTextInput label="Sexe (HOMME / FEMME)" placeholder="HOMME" value={sex} onChangeText={setSex} />
            <MedosTextInput label="Date de naissance (AAAA-MM-JJ)" placeholder="1990-01-01" value={naissance} onChangeText={setNaissance} />
            <MedosTextInput label="Groupe sanguin" placeholder="A+" value={groupe} onChangeText={setGroupe} />
            <MedosTextInput label="Ville" placeholder="Paris" value={ville} onChangeText={setVille} />
            <MedosTextInput label="Adresse" placeholder="7 rue de la Paix" value={adresse} onChangeText={setAdresse} />
            <MedosButton title="Enregistrer mon profil" onPress={handleSave} loading={saving} />
            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MedosColors.line,
  },
  content: { padding: 24, gap: 12, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: MedosColors.navy, marginTop: 8 },
  subtitle: { fontSize: 14, color: MedosColors.tealDark, fontWeight: '600' },
  center: { textAlign: 'center', color: MedosColors.slate, marginTop: 40 },
  infoCard: {
    marginTop: 16,
    backgroundColor: MedosColors.mist,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedosColors.line,
    padding: 20,
    gap: 12,
  },
  infoName: { fontSize: 18, fontWeight: '800', color: MedosColors.navy },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 14, color: MedosColors.slate },
  infoValue: { fontSize: 14, fontWeight: '600', color: MedosColors.ink },
  completeForm: { marginTop: 16, gap: 12 },
  formTitle: { fontSize: 18, fontWeight: '800', color: MedosColors.navy },
  formHint: { fontSize: 13, color: MedosColors.slate, marginBottom: 4 },
  errorText: { fontSize: 12, color: '#991b1b', textAlign: 'center' },
});
