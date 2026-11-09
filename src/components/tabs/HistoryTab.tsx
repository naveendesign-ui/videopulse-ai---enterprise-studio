import React, { useState } from 'react';
import { PipelineJob } from '../../types';

interface HistoryTabProps {
  jobs: PipelineJob[];
  onSelectJob: (job: PipelineJob) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ jobs, onSelectJob }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedAuditJob, setSelectedAuditJob] = useState<PipelineJob | null>(null);

  const defaultHistory = [
    {
      id: 'hist-1',
      filename: 'Q4_Earnings_Call_Master_4K.mp4',
      completedAt: 'Today at 14:20',
      duration: '45:12',
      modelUsed: 'Whisper v3 + OpenCV',
      status: 'Success',
      size: '3.4 GB',
      tokens: 4210,
    },
    {
      id: 'hist-2',
      filename: 'Product_Keynote_Launch_2025.mov',
      completedAt: 'Yesterday at 09:15',
      duration: '18:30',
      modelUsed: 'Whisper v3',
      status: 'Success',
      size: '5.2 GB',
      tokens: 1840,
    },
    {
      id: 'hist-3',
      filename: 'Engineering_Sync_Weekly_102.mkv',
      completedAt: '3 days ago',
      duration: '62:00',
      modelUsed: 'Multimodal Fusion',
      status: 'Success',
      size: '4.1 GB',
      tokens: 6150,
    },
    {
      id: 'hist-4',
      filename: 'Security_Surveillance_EastWing_1080p.mp4',
      completedAt: 'Today at 11:48',
      duration: '120:00',
      modelUsed: 'OpenCV Spatial Parser',
      status: 'Success',
      size: '8.1 GB',
      tokens: 890,
    },
  ];

  const filteredHistory = defaultHistory.filter((item) =>
    item.filename.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.modelUsed.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-space-lg">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Processing History & Audit Logs</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Complete record of all ingested video pipelines, latency benchmarks, and AI model executions.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg pl-9 pr-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
              placeholder="Search history..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                const matched = jobs.find((j) => j.filename === item.filename);
                if (matched) {
                  onSelectJob(matched);
                } else {
                  setSelectedAuditJob({
                    id: item.id,
                    filename: item.filename,
                    duration: item.duration,
                    durationSeconds: 1200,
                    codec: 'H.264 / AAC',
                    status: 'completed',
                    stageName: 'Completed',
                    progress: 100,
                    steps: [],
                    startedAt: item.completedAt,
                    completedAt: item.completedAt,
                    fileSize: item.size,
                    sttAccuracy: 99.4,
                  });
                }
              }}
              className="bg-surface-container p-4 rounded-lg border border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary p-2 bg-primary-container/20 rounded-lg shrink-0">
                  done_all
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {item.filename}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Completed {item.completedAt} • Duration: {item.duration} • {item.modelUsed} • Size: {item.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded border border-secondary/30 font-medium">
                  {item.status}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Detail Modal */}
      {selectedAuditJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-on-surface">{selectedAuditJob.filename}</h3>
                <span className="text-xs text-primary font-mono">Audit Execution Trace ID: vp-{selectedAuditJob.id}</span>
              </div>
              <button
                onClick={() => setSelectedAuditJob(null)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-xs text-on-surface-variant space-y-1.5 max-h-60 overflow-y-auto">
              <div className="text-secondary">[00:00:01] Ingestion started: file verified 100% integrity</div>
              <div className="text-on-surface">[00:00:03] FFmpeg demux: extracted 48kHz float32 audio track</div>
              <div className="text-on-surface">[00:00:08] Whisper large-v3: beam_size=5, temperature=0.0</div>
              <div className="text-on-surface">[00:00:14] Speaker diarization: identified 3 discrete speakers</div>
              <div className="text-on-surface">[00:00:22] OpenCV scene parsing: 5 keyframe transitions identified</div>
              <div className="text-on-surface">[00:00:30] OCR recognition: text embeddings indexed to vector store</div>
              <div className="text-primary">[00:00:35] Cross-attention multimodal fusion completed in 140ms</div>
              <div className="text-secondary">[00:00:36] Pipeline status: SUCCESS (Word Error Rate: 0.6%)</div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setSelectedAuditJob(null)}
                className="bg-surface-container-high text-on-surface text-xs px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
