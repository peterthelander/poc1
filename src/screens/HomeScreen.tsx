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
  const scrollToBottom = () =>
    scrollViewRef.current?.scrollToEnd({ animated: true });

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    const result = await getLLM().chat(prompt);
    setHistory((prev) => [...prev, { question: prompt, answer: result }]);
    setPrompt('');
    Keyboard.dismiss();
    scrollToBottom();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={64}
    >
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.history}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 96,
          }}
          onContentSizeChange={scrollToBottom}
        >
          {history.map((item, index) => (
            <View key={index} style={styles.entry}>
              <ThemedText style={styles.question}>{item.question}</ThemedText>
              <ThemedText style={styles.answer}>{item.answer}</ThemedText>
            </View>
          ))}
        </ScrollView>
        <Button title="Go to Help" onPress={() => navigation.navigate('Help')} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingTop: 8,
          }}
        >
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Type a prompt"
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleAsk}
            onFocus={scrollToBottom}
          />
          <Button title="Ask" onPress={handleAsk} />
        </View>
        <View style={{ height: insets.bottom + 8 }} />
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
