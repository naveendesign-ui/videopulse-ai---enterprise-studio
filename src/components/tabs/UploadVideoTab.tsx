import React, { useState, useRef } from 'react';
import { PipelineJob } from '../../types';

interface UploadVideoTabProps {
  onJobCreated: (job: PipelineJob) => void;
  onNavigateToDashboard: () => void;
}

export const UploadVideoTab: React.FC<UploadVideoTabProps> = ({
  onJobCreated,
  onNavigateToDashboard,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ffmpegChecked, setFfmpegChecked] = useState(true);
  const [whisperChecked, setWhisperChecked] = useState(true);
  const [opencvChecked, setOpencvChecked] = useState(true);
  const [sentimentChecked, setSentimentChecked] = useState(true);
  const [selectedModel, setSelectedModel] = useState('Whisper large-v3');
  const [language, setLanguage] = useState('Auto-Detect (Multilingual)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startSimulatedUpload(e.dataTransfer.files[0].name, (e.dataTransfer.files[0].size / (1024 * 1024)).toFixed(1) + ' MB');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      startSimulatedUpload(file.name, (file.size / (1024 * 1024)).toFixed(1) + ' MB');
    }
  };

  const startSimulatedUpload = (filename: string, sizeStr: string = '2.4 GB') => {
    setUploadProgress(15);
    setUploadStatus('Uploading high-resolution video stream...');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 20;
        if (prev < 80) {
          setUploadStatus('Ingesting media track & initiating FFmpeg demuxer...');
          return prev + 25;
        }
        if (prev >= 80 && prev < 100) {
          setUploadStatus('Finalizing neural pipeline container...');
          return 100;
        }
        clearInterval(interval);
        setTimeout(() => {
          const newJob: PipelineJob = {
            id: `job-${Date.now()}`,
            filename,
            duration: '24:18',
            durationSeconds: 1458,
            codec: 'H.264 / AAC',
            status: 'running',
            stageName: 'Audio Extraction',
            progress: 25,
            fileSize: sizeStr,
            sttAccuracy: 99.3,
            startedAt: 'Just now',
            steps: [
              { name: 'FFmpeg Audio', status: 'running', icon: 'sync' },
              { name: 'Whisper STT', status: 'pending', icon: 'schedule' },
              { name: 'OpenCV Scene', status: 'pending', icon: 'schedule' },
              { name: 'Fusion & Index', status: 'pending', icon: 'schedule' },
            ],
          };
          onJobCreated(newJob);
          onNavigateToDashboard();
        }, 600);
        return 100;
      });
    }, 400);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg">
        <h2 className="text-xl font-bold text-on-surface mb-2">
          Upload Video for Multimodal Analysis
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant mb-space-lg">
          Drag and drop high-res video files (MP4, MOV, MKV, ProRes) or configure batch parameters directly.
        </p>

        {/* Dropzone */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="video/*"
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 md:p-14 text-center flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${
            isDragging
              ? 'border-primary bg-primary-container/10 scale-[1.01]'
              : 'border-outline-variant/60 bg-surface-container/50 hover:border-primary'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold text-on-surface">
              Drop video files here or click to browse
            </h4>
            <p className="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
              Supports H.264, H.265, ProRes, and RAW codecs up to 8K resolution. Automatic audio extraction & keyframe OCR enabled.
            </p>
          </div>

          {uploadProgress !== null ? (
            <div className="w-full max-w-md mt-2 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-on-surface">
                <span>{uploadStatus}</span>
                <span className="font-bold text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg text-xs md:text-sm mt-2 shadow-lg shadow-primary/20 hover:bg-primary-fixed-dim transition-all pointer-events-none"
            >
              Select Video File
            </button>
          )}
        </div>

        {/* Pipeline Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg">
          <div
            onClick={() => setFfmpegChecked(!ffmpegChecked)}
            className="bg-surface-container p-space-md rounded-lg border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <label className="flex items-center gap-3 cursor-pointer pointer-events-none">
              <input
                checked={ffmpegChecked}
                onChange={() => {}}
                className="w-4 h-4 rounded bg-surface border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className="text-xs md:text-sm font-semibold text-on-surface">
                FFmpeg Audio Extraction
              </span>
            </label>
            <p className="text-xs text-on-surface-variant mt-2">
              Isolates high-fidelity multi-channel audio tracks for precise STT.
            </p>
          </div>

          <div
            onClick={() => setWhisperChecked(!whisperChecked)}
            className="bg-surface-container p-space-md rounded-lg border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <label className="flex items-center gap-3 cursor-pointer pointer-events-none">
              <input
                checked={whisperChecked}
                onChange={() => {}}
                className="w-4 h-4 rounded bg-surface border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className="text-xs md:text-sm font-semibold text-on-surface">
                Whisper STT & Diarization
              </span>
            </label>
            <p className="text-xs text-on-surface-variant mt-2">
              Automatic speaker identification and timestamp alignment.
            </p>
          </div>

          <div
            onClick={() => setOpencvChecked(!opencvChecked)}
            className="bg-surface-container p-space-md rounded-lg border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <label className="flex items-center gap-3 cursor-pointer pointer-events-none">
              <input
                checked={opencvChecked}
                onChange={() => {}}
                className="w-4 h-4 rounded bg-surface border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className="text-xs md:text-sm font-semibold text-on-surface">
                OpenCV Scene Detection
              </span>
            </label>
            <p className="text-xs text-on-surface-variant mt-2">
              Keyframe indexing, OCR slide extraction, and visual anomaly tags.
            </p>
          </div>
        </div>

        {/* Quick presets for testing */}
        <div className="mt-space-lg p-4 bg-surface-container rounded-lg border border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h5 className="text-xs font-semibold text-on-surface">Quick Enterprise Demo Videos</h5>
            <p className="text-[11px] text-on-surface-variant">Click to test instant ingestion pipeline:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => startSimulatedUpload('Q1_Financial_Results_Full.mp4', '1.8 GB')}
              className="text-xs bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-1.5 rounded border border-outline-variant/30 flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-xs text-primary">play_arrow</span>
              Earnings_Call.mp4
            </button>
            <button
              onClick={() => startSimulatedUpload('Cloud_Native_Summit_2025.mp4', '2.6 GB')}
              className="text-xs bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-1.5 rounded border border-outline-variant/30 flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-xs text-secondary">play_arrow</span>
              Tech_Summit.mp4
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
