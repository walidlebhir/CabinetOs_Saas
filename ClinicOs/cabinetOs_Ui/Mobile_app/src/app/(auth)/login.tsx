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

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Champs requis', 'Veuillez saisir votre email et mot de passe.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (error) {
      Alert.alert('Connexion impossible', getApiErrorMessage(error));
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
          <ThemedText style={styles.title}>Bon retour parmi nous</ThemedText>
          <ThemedText style={styles.subtitle}>
            Connectez-vous pour accéder à votre espace patient
          </ThemedText>
        </View>

        <View style={styles.form}>
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

          <Pressable style={styles.forgot}>
            <ThemedText style={styles.forgotText}>Mot de passe oublié ?</ThemedText>
          </Pressable>

          <MedosButton
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Pas encore de compte ?</ThemedText>
          <Pressable onPress={() => router.push('/register')}>
            <ThemedText style={styles.footerLink}>Créer un compte</ThemedText>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: MedosColors.navy,
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
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedosColors.tealDark,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 40,
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
