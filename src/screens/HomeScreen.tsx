import { NativeStackScreenProps } from '@react-navigation/native-stack';
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

import ThemedText from '../components/ThemedText';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getLLM } from '../services/llm/MockLLMService';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [controller, setController] = useState<AbortController | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const scrollToBottom = () => scrollViewRef.current?.scrollToEnd({ animated: true });

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    const question = prompt;
    setPrompt('');
    Keyboard.dismiss();
    const abortController = new AbortController();
    setController(abortController);
    setCurrentQuestion(question);
    setCurrentAnswer('');
    scrollToBottom();
    let answer = '';
    try {
      for await (const token of getLLM().chat(question, { signal: abortController.signal })) {
        answer += token;
        setCurrentAnswer(answer);
        scrollToBottom();
      }
    } finally {
      setHistory((prev) => [...prev, { question, answer }]);
      setCurrentQuestion('');
      setCurrentAnswer('');
      setController(null);
      scrollToBottom();
    }
  };

  const handleStop = () => {
    controller?.abort();
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
          {currentQuestion ? (
            <View key="stream" style={styles.entry}>
              <ThemedText style={styles.question}>{currentQuestion}</ThemedText>
              <ThemedText style={styles.answer}>{currentAnswer}</ThemedText>
            </View>
          ) : null}
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
            editable={!controller}
          />
          <Button
            title={controller ? 'Stop' : 'Ask'}
            onPress={controller ? handleStop : handleAsk}
          />
        </View>
        <View style={{ height: insets.bottom + 8 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  answer: {
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  entry: {
    marginBottom: 10,
  },
  history: {
    flex: 1,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
