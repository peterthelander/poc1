import { Text, StyleSheet, TextProps } from 'react-native';
import { ReactNode } from 'react';

export type ThemedTextProps = TextProps & {
  children: ReactNode;
};

export default function ThemedText({ style, children, ...rest }: ThemedTextProps) {
  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    color: '#000',
  },
});

