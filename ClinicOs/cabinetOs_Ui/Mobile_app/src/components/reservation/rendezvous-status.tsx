import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import type { RendezvousStatus } from '@/types/rendezvous';

const LABELS: Record<RendezvousStatus, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  TERMINE: 'Terminé',
  ANNULE: 'Annulé',
  ABSENT: 'Absent',
};

const COLORS: Record<RendezvousStatus, { bg: string; text: string }> = {
  EN_ATTENTE: { bg: '#fef3c7', text: '#92400e' },
  CONFIRME: { bg: MedosColors.frost, text: MedosColors.tealDark },
  TERMINE: { bg: '#dcfce7', text: '#166534' },
  ANNULE: { bg: '#fee2e2', text: '#991b1b' },
  ABSENT: { bg: '#e2e8f0', text: '#475569' },
};

export function RendezvousStatusBadge({
  status,
}: {
  status: RendezvousStatus;
}) {
  const palette = COLORS[status] ?? COLORS.EN_ATTENTE;
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <ThemedText style={[styles.text, { color: palette.text }]}>
        {LABELS[status] ?? status}
      </ThemedText>
    </View>
  );
}

export function formatDate(value: string): string {
  const d = new Date(value + 'T00:00:00');
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
