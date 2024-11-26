export interface ConversionJob {
  settings(file: File, targetFormat: string, arg2: (progress: number) => void, settings: any): unknown;
  id: string;
  file: File;
  targetFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  error?: string;
  result?: Blob;
}

export const SUPPORTED_FORMATS = {
  'image/jpeg': ['.png', '.webp', '.jpg', '.svg', '.pdf'],
  'image/png': ['.jpg', '.webp', '.png', '.svg', '.pdf'],
  'image/webp': ['.jpg', '.png', '.webp', '.svg', '.pdf'],
  'image/gif': ['.jpg', '.png', '.webp', '.svg', '.pdf'],
  'image/svg+xml': ['.png', '.jpg', '.webp', '.pdf'],
  'video/mp4': ['.webm', '.gif', '.mov'],
  'video/webm': ['.mp4', '.gif', '.mov'],
  'video/quicktime': ['.mp4', '.webm', '.gif'],
  'audio/mpeg': ['.wav', '.ogg', '.m4a'],
  'audio/wav': ['.mp3', '.ogg', '.m4a'],
  'audio/ogg': ['.mp3', '.wav', '.m4a'],
  'application/pdf': ['.docx', '.md', '.txt', '.jpg', '.png'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.pdf', '.md', '.txt'],
  'text/markdown': ['.pdf', '.docx', '.txt'],
  'text/plain': ['.pdf', '.docx', '.md'],
} as const;
