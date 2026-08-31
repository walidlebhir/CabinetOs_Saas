import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { MedosColors } from '@/constants/theme';

type MedosButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
};

export function MedosButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: MedosButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : MedosColors.teal}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary' && styles.labelPrimary,
            variant === 'outline' && styles.labelOutline,
            variant === 'ghost' && styles.labelGhost,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: MedosColors.teal,
    shadowColor: MedosColors.teal,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  outline: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: MedosColors.line,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: 700,
  },
  labelPrimary: {
    color: '#ffffff',
  },
  labelOutline: {
    color: MedosColors.navy,
  },
  labelGhost: {
    color: MedosColors.tealDark,
  },
});
