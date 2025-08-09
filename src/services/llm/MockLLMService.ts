export interface LLMService {
  chat(
    prompt: string,
    options?: {
      signal?: AbortSignal;
    },
  ): AsyncIterable<string>;
}

export class MockLLMService implements LLMService {
  async *chat(prompt: string, { signal }: { signal?: AbortSignal } = {}): AsyncGenerator<string> {
    const tokens = 'This is a mock response.'.split(' ');
    for (const token of tokens) {
      await new Promise<void>((resolve) => {
        const id = setTimeout(resolve, 50);
        signal?.addEventListener(
          'abort',
          () => {
            clearTimeout(id);
            resolve();
          },
          { once: true },
        );
      });
      if (signal?.aborted) {
        break;
      }
      yield token + ' ';
    }
  }
}

let instance: LLMService | null = null;

export function getLLM(): LLMService {
  if (!instance) {
    instance = new MockLLMService();
  }
  return instance;
}
