export type AppTab =
  | 'Dashboard'
  | 'Upload Video'
  | 'Video Analysis'
  | 'Transcript'
  | 'AI Summary'
  | 'Highlights'
  | 'Analytics'
  | 'History'
  | 'Settings';

export interface PipelineStep {
  name: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  icon: string;
}

export interface PipelineJob {
  id: string;
  filename: string;
  duration: string;
  durationSeconds: number;
  codec: string;
  status: 'running' | 'queued' | 'completed' | 'failed';
  stageName: string;
  progress: number;
  steps: PipelineStep[];
  startedAt: string;
  completedAt?: string;
  fileSize: string;
  sttAccuracy: number;
}

export interface Highlight {
  id: string;
  title: string;
  timeRange: string;
  startSeconds: number;
  endSeconds: number;
  score: number;
  tag: 'Finance' | 'Engineering' | 'Strategy' | 'Product' | 'Executive';
  thumbnail: string;
  description: string;
}

export interface Scene {
  id: string;
  timestamp: string;
  seconds: number;
  title: string;
  ocrText: string;
  confidence: number;
  tag: string;
}

export interface TranscriptLine {
  id: string;
  timestamp: string;
  seconds: number;
  speaker: string;
  speakerColor: 'secondary' | 'tertiary' | 'primary';
  text: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

export interface AppSettings {
  whisperApiKey: string;
  model: string;
  gpuAcceleration: boolean;
  diarizationSensitivity: number;
  autoExtractHighlights: boolean;
  exportFormat: string;
  slackWebhookUrl: string;
}
