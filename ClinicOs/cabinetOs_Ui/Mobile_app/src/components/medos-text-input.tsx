import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MedosColors } from '@/constants/theme';

type MedosTextInputProps = TextInputProps & {
  label?: string;
};

export function MedosTextInput({ label, style, ...rest }: MedosTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText style={styles.label}>{label}</ThemedText>
      ) : null}
      <TextInput
        placeholderTextColor={MedosColors.slate}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.inputFocused, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: MedosColors.ink,
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: MedosColors.line,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 16,
    color: MedosColors.ink,
  },
  inputFocused: {
    borderColor: MedosColors.teal,
  },
});
