import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory persistent database store
interface PipelineJob {
  id: string;
  filename: string;
  duration: string;
  durationSeconds: number;
  codec: string;
  status: 'running' | 'queued' | 'completed' | 'failed';
  stageName: string;
  progress: number;
  fileSize: string;
  sttAccuracy: number;
  startedAt: string;
  completedAt?: string;
  steps: { name: string; status: 'completed' | 'running' | 'pending' | 'failed'; icon: string }[];
}

let pipelineJobs: PipelineJob[] = [
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

let serverSettings = {
  whisperApiKey: 'sk-proj-9832479823749823749283',
  model: 'OpenAI Whisper large-v3 (Recommended)',
  gpuAcceleration: true,
  diarizationSensitivity: 0.85,
  autoExtractHighlights: true,
  exportFormat: 'SRT + WebVTT + JSON',
  slackWebhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXX',
};

// Background pipeline ticker to simulate live distributed processing
setInterval(() => {
  pipelineJobs = pipelineJobs.map((job) => {
    if (job.status === 'running') {
      const nextProgress = job.progress >= 98 ? 100 : job.progress + 2;
      const isComplete = nextProgress === 100;
      return {
        ...job,
        progress: nextProgress,
        status: isComplete ? 'completed' : 'running',
        stageName: isComplete ? 'Index Complete' : job.stageName,
        completedAt: isComplete ? 'Just now' : job.completedAt,
        steps: job.steps.map((s, idx) => {
          if (idx < 3) return { ...s, status: 'completed' as const, icon: 'check' };
          return {
            ...s,
            status: isComplete ? ('completed' as const) : ('running' as const),
            icon: isComplete ? 'check' : 'sync',
          };
        }),
      };
    }
    return job;
  });
}, 3000);

// --- REST API ENDPOINTS ---

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    connected: true,
    engine: 'VideoPulse AI Multimodal Core v4.2',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    workers: 4,
    gpuAcceleration: serverSettings.gpuAcceleration,
  });
});

// 2. Pipelines API
app.get('/api/pipelines', (req: Request, res: Response) => {
  res.json({
    success: true,
    total: pipelineJobs.length,
    jobs: pipelineJobs,
  });
});

app.post('/api/pipelines', (req: Request, res: Response) => {
  const { filename, duration, codec, template } = req.body;
  if (!filename) {
    return res.status(400).json({ success: false, error: 'Filename is required' });
  }

  const newJob: PipelineJob = {
    id: `job-${Date.now()}`,
    filename,
    duration: duration || '32:15',
    durationSeconds: 1935,
    codec: codec || 'H.264 / AAC',
    status: 'running',
    stageName: 'Audio Ingestion',
    progress: 10,
    fileSize: '2.4 GB',
    sttAccuracy: 99.3,
    startedAt: 'Just now',
    steps: [
      { name: 'FFmpeg Audio', status: 'running', icon: 'sync' },
      { name: 'Whisper STT', status: 'pending', icon: 'schedule' },
      { name: 'OpenCV Scene', status: 'pending', icon: 'schedule' },
      { name: 'Fusion & Index', status: 'pending', icon: 'schedule' },
    ],
  };

  pipelineJobs.unshift(newJob);
  res.status(201).json({ success: true, job: newJob });
});

app.delete('/api/pipelines/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  pipelineJobs = pipelineJobs.filter((j) => j.id !== id);
  res.json({ success: true, message: `Job ${id} deleted` });
});

// 3. Settings API
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, settings: serverSettings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  serverSettings = { ...serverSettings, ...req.body };
  res.json({ success: true, settings: serverSettings });
});


// 4. Server-Side AI Summarization using Gemini API
app.post('/api/ai/summarize', async (req: Request, res: Response) => {
  const { transcriptText, focusArea } = req.body;

  if (!transcriptText || typeof transcriptText !== 'string' || !transcriptText.trim()) {
    return res.status(400).json({
      success: false,
      error: 'A valid transcript is required.',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      error: 'Gemini API key is not configured.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are the AI summarization engine for VideoPulse AI.

Analyze ONLY the transcript provided below.

Generate:
1. Executive Summary (2-3 concise sentences).
2. Three important factual highlights from the transcript.
3. Three to four actionable points based on the transcript.

Do not invent statistics, revenue figures, events, or technical claims.
If quantitative information is absent, explicitly mention that.

Focus area: ${focusArea || 'General'}

Transcript:
${transcriptText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response.');
    }

    return res.json({
      success: true,
      source: 'gemini-2.5-flash',
      summary: response.text,
    });

  } catch (err: any) {
    console.error('Gemini API error:', err.message);

    return res.status(502).json({
      success: false,
      error: 'Gemini summarization failed.',
      details: err.message,
    });
  }
});

// --- VITE MIDDLEWARE INTEGRATION ---
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VideoPulse AI Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
