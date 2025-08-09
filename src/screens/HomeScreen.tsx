import { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getLLM } from '../services/llm/MockLLMService';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    const result = await getLLM().chat(prompt);
    setAnswer(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Type a prompt"
      />
      <Button title="Ask" onPress={handleAsk} />
      {answer ? <Text style={styles.response}>{answer}</Text> : null}
      <Button title="Go to Help" onPress={() => navigation.navigate('Help')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 10,
  },
  response: {
    marginVertical: 10,
    textAlign: 'center',
  },
});
