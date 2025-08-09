export interface LLMService {
  chat(prompt: string): Promise<string>;
}

export class MockLLMService implements LLMService {
  async chat(prompt: string): Promise<string> {
    return Promise.resolve('This is a mock response.');
  }
}

let instance: LLMService | null = null;

export function getLLM(): LLMService {
  if (!instance) {
    instance = new MockLLMService();
  }
  return instance;
}
