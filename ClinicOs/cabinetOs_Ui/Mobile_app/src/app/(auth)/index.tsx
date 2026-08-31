import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedosButton } from '@/components/medos-button';
import { MedosHealthHero } from '@/components/medos-health-hero';
import { MedosLogo } from '@/components/medos-logo';
import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MedosLogo />
        </View>

        <View style={styles.heroVisual}>
          <MedosHealthHero />
        </View>

        <View style={styles.hero}>
          <ThemedText style={styles.title}>Votre santé,{'\n'}simplifiée</ThemedText>
          <ThemedText style={styles.subtitle}>
            MedOS Patient, la plateforme sanitaire qui connecte votre dossier
            médical à votre cabinet.
          </ThemedText>
        </View>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <TextSymbol>RDV</TextSymbol>
            </View>
            <View style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Prise de rendez-vous</ThemedText>
              <ThemedText style={styles.featureDesc}>
                Réservez ou annulez vos consultations en quelques secondes.
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <TextSymbol>DOS</TextSymbol>
            </View>
            <View style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Dossier médical</ThemedText>
              <ThemedText style={styles.featureDesc}>
                Accédez à vos documents, ordonnances et résultats en toute confidentialité.
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <TextSymbol>MSG</TextSymbol>
            </View>
            <View style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Notifications & rappels</ThemedText>
              <ThemedText style={styles.featureDesc}>
                Recevez des rappels de rendez-vous et les messages de votre médecin.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <MedosButton
            title="Se connecter"
            variant="primary"
            onPress={() => router.push('/login')}
          />
          <MedosButton
            title="Créer un compte"
            variant="outline"
            onPress={() => router.push('/register')}
          />
        </View>

        <ThemedText style={styles.footer}>
          Application dédiée aux patients de votre cabinet médical
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}

function TextSymbol({ children }: { children: string }) {
  return <ThemedText style={styles.featureSymbol}>{children}</ThemedText>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  heroVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  hero: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: MedosColors.navy,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: MedosColors.slate,
    textAlign: 'center',
  },
  features: {
    gap: 20,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: MedosColors.mist,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedosColors.line,
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: MedosColors.frost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureSymbol: {
    fontSize: 12,
    fontWeight: '800',
    color: MedosColors.tealDark,
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MedosColors.ink,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: MedosColors.slate,
  },
  actions: {
    gap: 12,
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 12,
    color: MedosColors.slate,
  },
});
