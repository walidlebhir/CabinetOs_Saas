import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedosButton } from '@/components/medos-button';
import { MedosLogo } from '@/components/medos-logo';
import { MedosTextInput } from '@/components/medos-text-input';
import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Champs requis', 'Veuillez saisir votre prénom et votre nom.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Champs requis', 'Veuillez saisir votre adresse e-mail.');
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        'Mot de passe trop court',
        'Le mot de passe doit contenir au moins 6 caractères.'
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
      });
      Alert.alert(
        'Compte créé',
        'Votre compte patient a été créé. Vous pouvez maintenant vous connecter.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (error) {
      Alert.alert('Inscription impossible', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ThemedText style={styles.backText}>← Retour</ThemedText>
        </Pressable>

        <View style={styles.header}>
          <MedosLogo />
          <ThemedText style={styles.title}>Créer votre compte</ThemedText>
          <ThemedText style={styles.subtitle}>
            Rejoignez votre espace patient en quelques secondes
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <MedosTextInput
                label="Prénom"
                placeholder="Jean"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.rowItem}>
              <MedosTextInput
                label="Nom"
                placeholder="Dupont"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <MedosTextInput
            label="Adresse e-mail"
            placeholder="vous@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <MedosTextInput
            label="Mot de passe"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <MedosTextInput
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <MedosButton
            title="Créer mon compte"
            onPress={handleRegister}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Déjà un compte ?</ThemedText>
          <Pressable onPress={() => router.push('/login')}>
            <ThemedText style={styles.footerLink}>Se connecter</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  back: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: MedosColors.tealDark,
  },
  header: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: MedosColors.navy,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: MedosColors.slate,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: MedosColors.slate,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: MedosColors.tealDark,
  },
});
