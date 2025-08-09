import { StyleSheet, View } from 'react-native';

import ThemedText from '../components/ThemedText';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <ThemedText>Help Screen</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
