import { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getLLM } from '../services/llm/MockLLMService';
import ThemedText from '../components/ThemedText';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    const result = await getLLM().chat(prompt);
    setHistory((prev) => [...prev, { question: prompt, answer: result }]);
    setPrompt('');
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.history}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {history.map((item, index) => (
            <View key={index} style={styles.entry}>
              <ThemedText style={styles.question}>{item.question}</ThemedText>
              <ThemedText style={styles.answer}>{item.answer}</ThemedText>
            </View>
          ))}
        </ScrollView>
        <Button title="Go to Help" onPress={() => navigation.navigate('Help')} />
        <View style={{ padding: 16 }}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Type a prompt"
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleAsk}
          />
          <Button title="Ask" onPress={handleAsk} />
        </View>
        <View style={{ height: insets.bottom + 16 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  history: {
    flex: 1,
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
  },
});
