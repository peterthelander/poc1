import * as FileSystem from 'expo-file-system';

export interface ModelManifest {
  id: string;
  url: string;
  sha256: string;
}

const MODELS_DIR = `${FileSystem.documentDirectory}models`;

export function getModelPath(modelId: string): string {
  return `${MODELS_DIR}/${modelId}`;
}

export async function hasModel(modelId: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(getModelPath(modelId));
  return info.exists;
}

export async function verifyChecksum(file: string, sha256: string): Promise<boolean> {
  const digest = await FileSystem.digestAsync(file, 'sha256');
  return digest.toLowerCase() === sha256.toLowerCase();
}

export async function downloadModel(
  modelId: string,
  url: string,
  sha256: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  await FileSystem.makeDirectoryAsync(MODELS_DIR, { intermediates: true });
  const path = getModelPath(modelId);
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    path,
    {},
    (progress) => {
      if (onProgress && progress.totalBytesExpectedToWrite) {
        onProgress(progress.totalBytesWritten / progress.totalBytesExpectedToWrite);
      }
    },
  );

  const result = await downloadResumable.downloadAsync();
  if (!result) {
    throw new Error('Download failed');
  }

  const valid = await verifyChecksum(path, sha256);
  if (!valid) {
    await FileSystem.deleteAsync(path, { idempotent: true });
    throw new Error('Checksum mismatch');
  }

  return path;
}
