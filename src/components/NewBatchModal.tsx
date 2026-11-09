import React, { useState } from 'react';
import { PipelineJob } from '../types';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBatch: (newJob: PipelineJob) => void;
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({
  isOpen,
  onClose,
  onStartBatch,
}) => {
  const [batchName, setBatchName] = useState('');
  const [template, setTemplate] = useState('Full Multimodal Suite (FFmpeg + Whisper + OpenCV)');
  const [duration, setDuration] = useState('32:15');
  const [codec, setCodec] = useState('H.264 / AAC');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = batchName.trim() || `Enterprise_Batch_${new Date().toISOString().slice(11, 19).replace(/:/g, '')}.mp4`;

    const newJob: PipelineJob = {
      id: `job-${Date.now()}`,
      filename: finalName.endsWith('.mp4') || finalName.endsWith('.mov') ? finalName : `${finalName}.mp4`,
      duration,
      durationSeconds: 1935,
      codec,
      status: 'running',
      stageName: 'Audio Ingestion',
      progress: 12,
      fileSize: '2.1 GB',
      sttAccuracy: 99.2,
      startedAt: 'Just now',
      steps: [
        { name: 'FFmpeg Audio', status: 'running', icon: 'sync' },
        { name: 'Whisper STT', status: 'pending', icon: 'schedule' },
        { name: 'OpenCV Scene', status: 'pending', icon: 'schedule' },
        { name: 'Fusion & Index', status: 'pending', icon: 'schedule' },
      ],
    };

    onStartBatch(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-space-lg w-full max-w-lg shadow-2xl flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-on-surface">Create New Video Batch</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant">
          Queue multiple video files for simultaneous AI summarization, scene extraction, and vector embedding.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">Batch / Video Name</label>
            <input
              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
              placeholder="e.g. Q1_Keynote_Product_Launches.mp4"
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">Select Pipeline Template</label>
            <select
              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option>Full Multimodal Suite (FFmpeg + Whisper + OpenCV)</option>
              <option>Audio Transcription Only (Whisper large-v3)</option>
              <option>Highlight Extraction & OCR Only</option>
              <option>High-Throughput Enterprise Batch (A100 TensorRT)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">Target Codec</label>
              <select
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                value={codec}
                onChange={(e) => setCodec(e.target.value)}
              >
                <option>H.264 / AAC</option>
                <option>H.265 / HEVC</option>
                <option>Apple ProRes 422</option>
                <option>AV1 / Opus</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">Estimated Duration</label>
              <input
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="MM:SS"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-outline-variant/20">
            <button
              type="button"
              className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-xs hover:bg-surface-bright transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-on-primary font-semibold px-5 py-2 rounded-lg text-xs shadow-lg shadow-primary/20 hover:bg-primary-fixed-dim transition-all"
            >
              Start Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
