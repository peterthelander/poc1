import { useState } from 'react';
import { StyleSheet, View, Button, TextInput, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getLLM } from '../services/llm/MockLLMService';
import ThemedText from '../components/ThemedText';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    const result = await getLLM().chat(prompt);
    setHistory((prev) => [...prev, { question: prompt, answer: result }]);
    setPrompt('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.history} contentContainerStyle={styles.historyContent}>
        {history.map((item, index) => (
          <View key={index} style={styles.entry}>
            <ThemedText style={styles.question}>{item.question}</ThemedText>
            <ThemedText style={styles.answer}>{item.answer}</ThemedText>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Type a prompt"
      />
      <Button title="Ask" onPress={handleAsk} />
      <Button title="Go to Help" onPress={() => navigation.navigate('Help')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  history: {
    flex: 1,
    marginBottom: 10,
  },
  historyContent: {
    paddingBottom: 10,
  },
  entry: {
    marginBottom: 10,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  answer: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
  },
});
