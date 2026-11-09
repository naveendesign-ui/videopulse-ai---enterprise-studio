import {
  Highlight,
  NotificationItem,
  PipelineJob,
  Scene,
  TranscriptLine,
  AppSettings,
} from '../types';

export const INITIAL_PIPELINE_JOBS: PipelineJob[] = [
  {
    id: 'job-1',
    filename: 'Q4_Earnings_Call_Master_4K.mp4',
    duration: '45:12',
    durationSeconds: 2712,
    codec: 'H.264/AAC',
    status: 'running',
    stageName: 'Multimodal Fusion',
    progress: 88,
    fileSize: '3.4 GB',
    sttAccuracy: 99.4,
    startedAt: '14:02 Today',
    steps: [
      { name: 'FFmpeg Audio', status: 'completed', icon: 'check' },
      { name: 'Whisper STT', status: 'completed', icon: 'check' },
      { name: 'OpenCV Scene', status: 'completed', icon: 'check' },
      { name: 'Fusion & Index', status: 'running', icon: 'sync' },
    ],
  },
  {
    id: 'job-2',
    filename: 'Product_Keynote_Launch_2025.mov',
    duration: '18:30',
    durationSeconds: 1110,
    codec: 'ProRes 422',
    status: 'queued',
    stageName: 'Queued',
    progress: 0,
    fileSize: '5.2 GB',
    sttAccuracy: 98.9,
    startedAt: '14:15 Today',
    steps: [
      { name: 'FFmpeg Audio', status: 'pending', icon: 'schedule' },
      { name: 'Whisper STT', status: 'pending', icon: 'schedule' },
      { name: 'OpenCV Scene', status: 'pending', icon: 'schedule' },
      { name: 'Fusion & Index', status: 'pending', icon: 'schedule' },
    ],
  },
  {
    id: 'job-3',
    filename: 'Security_Surveillance_EastWing_1080p.mp4',
    duration: '120:00',
    durationSeconds: 7200,
    codec: 'H.265 / HEVC',
    status: 'completed',
    stageName: 'Index Complete',
    progress: 100,
    fileSize: '8.1 GB',
    sttAccuracy: 99.1,
    startedAt: '11:30 Today',
    completedAt: '11:48 Today',
    steps: [
      { name: 'FFmpeg Audio', status: 'completed', icon: 'check' },
      { name: 'Whisper STT', status: 'completed', icon: 'check' },
      { name: 'OpenCV Scene', status: 'completed', icon: 'check' },
      { name: 'Fusion & Index', status: 'completed', icon: 'check' },
    ],
  },
];

export const INITIAL_HIGHLIGHTS: Highlight[] = [
  {
    id: 'hl-1',
    title: 'Keynote Financial Review',
    timeRange: '04:12 - 06:45',
    startSeconds: 252,
    endSeconds: 405,
    score: 98.2,
    tag: 'Finance',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVYBXt4KrZqJEhwiUJcqlAhP6ruC-upHUFo1tPEFafquxHphMaWgrKX6Wo2ew6GsPYG64RCaduvpH0Hcktmr7-QAoToWXN6mZhDBPGAKyPCi0U_ilnMiU2y6Tovn8fqmeMS4ZdT4ec3GGpFtSVDQJkCH064NSCXJFiXSrLwjswt2UiAnh6iplcH8qmK9uzbv6L9B3y8l8b7E-H5wMjEM-Fge8I0OYjTx5t8lfM0NM',
    description:
      'Executive financial milestone breakdown highlighting $50M+ ARR achievement and European market expansion.',
  },
  {
    id: 'hl-2',
    title: 'New Architecture Demo',
    timeRange: '12:05 - 15:30',
    startSeconds: 725,
    endSeconds: 930,
    score: 96.8,
    tag: 'Engineering',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCa41K1c3nVyZBGltdF-mkV9Nv5sEjbDLEDoDEg3dXHx7sCYam50LfglD6O7vPJkXtl6gFmsNhkMXl7gOAOA79FXaGebH406ueYqXUAifdxiBa6l2cK-ks-6mzlYr-uRR39CtLQCBfZGEEG2-agWIlqJAiLWMPyVB40EUqZscdS_CwCqkgA3YM2gtOSVbd1WUCAdIAWAB4Vtwxdkb_jl5irj86utK8CEnDQNgRp1gE',
    description:
      'Live demonstration of the real-time cross-attention engine linking speech diarization markers with OCR keyframes.',
  },
  {
    id: 'hl-3',
    title: 'ARR Surpasses Milestone',
    timeRange: '02:35 - 04:12',
    startSeconds: 155,
    endSeconds: 252,
    score: 99.1,
    tag: 'Finance',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcZ2XjiQ8auIyQXkThI7Lwu4r6QvWA5gkURmnRhQG-YAf5ZylqEjHr3uS1BkCThX6DqghVQ3Pqwf75eZzXLb84cvFytji0Gmif2ZOyqT9MwdVtn57LYhO3mSy-CI-fiZCr15hhBqRR5YsNvFOxuFWXdu5guDIefqArBpU_pO5FcdO3VKmtHAX2PcPzDsFpHV35LMx_aQWUC3l47D_c6UcVjr8wD-uHy0NOJmFraA8',
    description:
      'Record-breaking quarterly revenue metrics and accelerated enterprise customer adoption curve.',
  },
  {
    id: 'hl-4',
    title: 'Multimodal Architecture',
    timeRange: '05:12 - 08:30',
    startSeconds: 312,
    endSeconds: 510,
    score: 98.4,
    tag: 'Engineering',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAea8Ja3ySrlLdW7dsXeJeSUX2ZU2bpQ5JUFh4J-aEWVXa_sYn_Lrnn2tTVrGN9HhfUPAecfHcOvYvRvJ93R__5yrNga4UphMajiKxO66g_7dma2ueHEzEaUre6qHLmHl4Xw_UxJ1XsY6H_ca0HDebPmuxgiLnLnIi2Hfy4bbFM1IBmB-dp1VFUZTLzOhbejZSFa62ApPXGlOaOOdsEJ8-4rI4Gh9UsSlAYCBhmKPo',
    description:
      'Deep dive into the neural tensor pipeline, sub-140ms latency benchmarks, and GPU cluster throughput.',
  },
  {
    id: 'hl-5',
    title: 'Executive Q&A Highlights',
    timeRange: '14:20 - 18:45',
    startSeconds: 860,
    endSeconds: 1125,
    score: 97.8,
    tag: 'Strategy',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7r7qWGOg-7H8ARYmDvjCuq_g0bJAJKsq_-A8FV8bgkd0UC2yhMEc_ExMz06guLqGM0l-1rWZrCECb4HY9-HgSw1HMLvz9FGBYUOPq3Y8h-L4AV3_6RgSZWHhfJEIQ7i3epo9P9pUO89cJ6dhMC637QjiFF63bnhVfgCa83sdpfp0hzG8JIZD18ER39zWfS3Jw3hbd4XTo3sxHC_sXNtF4Y_2L2p8Ic08sGaLWJ4Y',
    description:
      'Strategic responses regarding multi-tenant data governance, on-premise deployments, and SOC2 compliance.',
  },
];

export const INITIAL_SCENES: Scene[] = [
  {
    id: 'scene-1',
    timestamp: '00:00',
    seconds: 0,
    title: 'Introduction & Agenda',
    ocrText: 'Q4 Roadmap & Financials',
    confidence: 99.5,
    tag: 'Agenda',
  },
  {
    id: 'scene-2',
    timestamp: '04:15',
    seconds: 255,
    title: 'Revenue Growth Analysis',
    ocrText: 'ARR Surpasses $50M',
    confidence: 98.8,
    tag: 'Financials',
  },
  {
    id: 'scene-3',
    timestamp: '12:30',
    seconds: 750,
    title: 'Architecture Demo',
    ocrText: 'Multimodal Vector Index',
    confidence: 97.9,
    tag: 'Architecture',
  },
  {
    id: 'scene-4',
    timestamp: '28:45',
    seconds: 1725,
    title: 'Q&A Session',
    ocrText: 'Open Floor Discussion',
    confidence: 96.4,
    tag: 'Discussion',
  },
  {
    id: 'scene-5',
    timestamp: '38:10',
    seconds: 2290,
    title: 'Roadmap & Closing Remarks',
    ocrText: '2025 Global Launch Timeline',
    confidence: 98.1,
    tag: 'Roadmap',
  },
];

export const INITIAL_TRANSCRIPT: TranscriptLine[] = [
  {
    id: 't-1',
    timestamp: '00:00:14',
    seconds: 14,
    speaker: 'Speaker 1 (Dr. Elena Vance)',
    speakerColor: 'secondary',
    text: 'Welcome everyone to the Q4 enterprise earnings call. Today we are thrilled to announce our breakthrough in multimodal video indexing speeds, dropping inference latency down to 140 milliseconds.',
  },
  {
    id: 't-2',
    timestamp: '00:01:05',
    seconds: 65,
    speaker: 'Speaker 2 (Marcus Chen)',
    speakerColor: 'tertiary',
    text: 'Thanks Elena. Looking at the infrastructure metrics, our transition to Whisper large-v3 combined with custom OpenCV scene parsers has boosted word recognition accuracy to 99.4 percent globally.',
  },
  {
    id: 't-3',
    timestamp: '00:02:40',
    seconds: 160,
    speaker: 'Speaker 1 (Dr. Elena Vance)',
    speakerColor: 'secondary',
    text: 'That scale is unprecedented. Our enterprise clients are now processing over ten thousand hours of high-definition security and webinar footage daily without bottlenecks.',
  },
  {
    id: 't-4',
    timestamp: '00:04:12',
    seconds: 252,
    speaker: 'Speaker 3 (Sarah Jenkins)',
    speakerColor: 'tertiary',
    text: "Let's dive directly into the financial breakout for the quarter, highlighting our ARR surge past fifty million dollars.",
  },
  {
    id: 't-5',
    timestamp: '00:06:20',
    seconds: 380,
    speaker: 'Speaker 3 (Sarah Jenkins)',
    speakerColor: 'tertiary',
    text: 'Gross margins expanded by 620 basis points as GPU batch scheduling minimized idle server capacity during off-peak processing hours.',
  },
  {
    id: 't-6',
    timestamp: '00:12:30',
    seconds: 750,
    speaker: 'Speaker 2 (Marcus Chen)',
    speakerColor: 'secondary',
    text: 'Demonstrating the new multimodal vector query: you can now query visual keyframes with natural language, returning exact video coordinates in sub-second time.',
  },
  {
    id: 't-7',
    timestamp: '00:18:45',
    seconds: 1125,
    speaker: 'Speaker 1 (Dr. Elena Vance)',
    speakerColor: 'secondary',
    text: 'Our enterprise security and compliance partners have also completed their SOC2 Type II audit, verifying end-to-end zero-retention encryption.',
  },
  {
    id: 't-8',
    timestamp: '00:28:45',
    seconds: 1725,
    speaker: 'Speaker 1 (Dr. Elena Vance)',
    speakerColor: 'primary',
    text: 'Now let us open up the session for questions from equity analysts and enterprise partners.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Pipeline Ingestion Complete',
    message: 'Security_Surveillance_EastWing_1080p.mp4 finished indexing.',
    time: '12m ago',
    type: 'success',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Cluster Throughput Warning',
    message: 'GPU Cluster us-east-1 reached 84% capacity during peak batch.',
    time: '45m ago',
    type: 'info',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Model Update Available',
    message: 'Whisper large-v3 turbo checkpoints ready for deployment.',
    time: '2h ago',
    type: 'info',
    read: true,
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  whisperApiKey: 'sk-proj-9832479823749823749283',
  model: 'OpenAI Whisper large-v3 (Recommended)',
  gpuAcceleration: true,
  diarizationSensitivity: 0.85,
  autoExtractHighlights: true,
  exportFormat: 'SRT + WebVTT + JSON',
  slackWebhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXX',
};
