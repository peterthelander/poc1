import { MockLLMService, LLMService } from './MockLLMService';
import { downloadModel, hasModel, ModelManifest } from './ModelManager';

export class OnDeviceLLMService implements LLMService {
  private delegate: LLMService = new MockLLMService();
  private initialized = false;

  constructor(private manifest: ModelManifest) {}

  private async ensureModel(): Promise<void> {
    if (this.initialized) return;
    const { id, url, sha256 } = this.manifest;
    if (!(await hasModel(id))) {
      await downloadModel(id, url, sha256, () => {});
    }
    this.initialized = true;
  }

  async *chat(prompt: string, { signal }: { signal?: AbortSignal } = {}): AsyncGenerator<string> {
    await this.ensureModel();
    yield* this.delegate.chat(prompt, { signal });
  }
}
