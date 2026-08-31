import { Building2, MapPin } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';
import type { CabinetHome } from '@/types/cabinet';

type CabinetCardProps = {
  cabinet: CabinetHome;
  onPress?: (cabinet: CabinetHome) => void;
  selected?: boolean;
};

export function CabinetCard({ cabinet, onPress, selected = false }: CabinetCardProps) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.left}>
        <View style={styles.icon}>
          <Building2 size={20} color={MedosColors.teal} />
        </View>
        <View style={styles.text}>
          <ThemedText style={styles.name}>{cabinet.nom}</ThemedText>
          <View style={styles.villeRow}>
            <MapPin size={12} color={MedosColors.slate} />
            <ThemedText style={styles.ville}>
              {cabinet.ville ?? cabinet.localisation ?? 'Ville non renseignée'}
            </ThemedText>
          </View>
          <ThemedText style={styles.specialite}>{cabinet.specialite}</ThemedText>
        </View>
      </View>
      <View style={styles.meta}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>
            {cabinet.nombreMedecins} médecin{cabinet.nombreMedecins > 1 ? 's' : ''}
          </ThemedText>
        </View>
        {hasCoords(cabinet) ? (
          <View style={[styles.badge, styles.badgeLoc]}>
            <ThemedText style={styles.badgeLocText}>Localisé</ThemedText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function hasCoords(
  cabinet: CabinetHome
): cabinet is CabinetHome & { latitude: number; longitude: number } {
  return (
    cabinet.latitude !== null &&
    cabinet.latitude !== undefined &&
    cabinet.longitude !== null &&
    cabinet.longitude !== undefined
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MedosColors.line,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardSelected: {
    borderColor: MedosColors.teal,
    backgroundColor: MedosColors.frost,
  },
  left: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: MedosColors.frost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: MedosColors.navy,
  },
  villeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ville: {
    fontSize: 12,
    color: MedosColors.slate,
  },
  specialite: {
    fontSize: 12,
    fontWeight: '600',
    color: MedosColors.tealDark,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: MedosColors.line,
    backgroundColor: MedosColors.frost,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: MedosColors.tealDark,
  },
  badgeLoc: {
    backgroundColor: '#ffffff',
    borderColor: MedosColors.line,
  },
  badgeLocText: {
    fontSize: 11,
    fontWeight: '600',
    color: MedosColors.slate,
  },
});
