import { USE_ON_DEVICE } from '../../config/flags';
import { OnDeviceLLMService } from './OnDeviceLLMService';
import type { ModelManifest } from './ModelManager';

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

const DEFAULT_MANIFEST: ModelManifest = {
  id: 'default-model',
  url: 'https://example.com/model.bin',
  sha256: '0'.repeat(64),
};

export function getLLM(): LLMService {
  if (!instance) {
    instance = USE_ON_DEVICE
      ? new OnDeviceLLMService(DEFAULT_MANIFEST)
      : new MockLLMService();
  }
  return instance;
}
