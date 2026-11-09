import { PipelineJob, AppSettings } from '../types';

export interface HealthResponse {
  status: string;
  connected: boolean;
  engine: string;
  uptimeSeconds: number;
  timestamp: string;
  workers: number;
  gpuAcceleration: boolean;
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getPipelines(): Promise<PipelineJob[]> {
    const res = await fetch('/api/pipelines');
    if (!res.ok) throw new Error('Failed to fetch pipelines');
    const data = await res.json();
    return data.jobs || [];
  },

  async createPipeline(jobData: {
    filename: string;
    duration?: string;
    codec?: string;
    template?: string;
  }): Promise<PipelineJob> {
    const res = await fetch('/api/pipelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to create pipeline');
    const data = await res.json();
    return data.job;
  },

  async deletePipeline(id: string): Promise<boolean> {
    const res = await fetch(`/api/pipelines/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getSettings(): Promise<AppSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: AppSettings): Promise<AppSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const data = await res.json();
    return data.settings;
  },

  async summarizeTranscript(
    transcriptText: string,
    focusArea?: string
  ): Promise<{ summary: string; source: string; keyActionItems?: string[] }> {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcriptText, focusArea }),
    });
    if (!res.ok) throw new Error('Failed to generate AI summary');
    return res.json();
  },
};
