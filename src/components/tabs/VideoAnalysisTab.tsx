import React, { useRef } from 'react';
import { Scene } from '../../types';
import { formatTimecode } from '../../utils/videoAnalytics';

interface VideoAnalysisTabProps {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  scenes: Scene[];
  selectedSceneId: string | null;
  onSelectScene: (scene: Scene) => void;
}

export const VideoAnalysisTab: React.FC<VideoAnalysisTabProps> = ({
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  onSeek,
  scenes,
  selectedSceneId,
  onSelectScene,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(Math.round(ratio * totalDuration));
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // Pre-calculated waveform bar heights for rich aesthetic
  const barHeights = [
    16, 32, 40, 24, 12, 36, 48, 40, 28, 16, 44, 20, 38, 46, 30, 18, 42, 50, 32, 22,
    36, 48, 42, 26, 14, 38, 46, 34, 20, 44, 50, 30, 24, 40, 48, 36, 18, 32, 44, 28,
  ];

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Video Player & Waveform Section */}
        <div className="lg:col-span-2 flex flex-col gap-space-md">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl">
            {/* Video Mock Screen */}
            <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden select-none">
              <img
                className="w-full h-full object-cover"
                alt="Video playback workspace showing tech presentation"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfw8yHI6KBIvZwOyRBLqVBrnAsnwylYOpKptcomC6zAK95dcq3MTolQwvQb6JUecih-xXJQDGmO4-MArQeEM9NWkORRWwiuvO1J1DCUwI6ehqQBWCJWQ5Mb9SlPyZ-gsl_dYMMgMzGkIlE6wZPdkSBe_gZ_vZSTnv3DVC2Dx8mKcRUK0Mw8Fk4NgK1UXs6xfUtzblHg4Y34TCUAex3n_pScYsf8ANKcvGVjoYLNXQ"
              />

              {/* Real-time OCR detection bounding box simulation */}
              <div className="absolute top-1/4 left-1/4 border-2 border-primary/70 bg-primary/10 rounded px-2 py-0.5 pointer-events-none animate-pulse">
                <span className="text-[10px] font-mono text-primary font-bold">
                  [OCR: Multimodal Fusion Engine 99.4%]
                </span>
              </div>

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-space-md">
                <div className="flex justify-between items-center">
                  <span className="bg-black/60 backdrop-blur text-primary text-xs px-3 py-1 rounded border border-primary/30 font-mono">
                    {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary/20 text-secondary text-xs px-3 py-1 rounded border border-secondary/30">
                      HD 1080p60
                    </span>
                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded border border-primary/30">
                      Whisper v3 Live
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <button
                    aria-label="Replay 10 seconds"
                    onClick={() => onSeek(Math.max(0, currentTime - 10))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">replay_10</span>
                  </button>

                  <button
                    id="play-btn"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    onClick={onTogglePlay}
                    className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shadow-primary/30"
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <button
                    aria-label="Forward 10 seconds"
                    onClick={() => onSeek(Math.min(totalDuration, currentTime + 10))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">forward_10</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Waveform Scrubber */}
            <div className="p-space-md bg-surface-container flex flex-col gap-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Audio Waveform & Highlight Density</span>
                <span className="text-primary font-medium">Confidence Peak: 98%</span>
              </div>

              <div
                ref={waveformRef}
                onClick={handleWaveformClick}
                className="h-12 w-full bg-surface-container-lowest rounded relative overflow-hidden flex items-center px-1 gap-1 cursor-pointer select-none group"
                title="Click anywhere to scrub playback"
              >
                {/* Simulated waveform bars */}
                {barHeights.map((h, i) => {
                  const barProgress = (i / barHeights.length) * 100;
                  const isPassed = barProgress <= progressPercent;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-150 ${
                        isPassed ? 'bg-primary' : 'bg-primary/30 group-hover:bg-primary/50'
                      }`}
                      style={{ height: `${h}px` }}
                    ></div>
                  );
                })}

                {/* Scrubber head line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_#ffffff] z-10 transition-all pointer-events-none"
                  style={{ left: `${progressPercent}%` }}
                >
                  <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md"></div>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-on-surface-variant/70 pt-1">
                <span>00:00 (Intro)</span>
                <span>04:15 (Revenue)</span>
                <span>12:30 (Architecture)</span>
                <span>28:45 (Q&A)</span>
                <span>{formatTimecode(totalDuration)} (End)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scene Detection Sidebar */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col">
          <div className="flex justify-between items-center mb-space-md">
            <h3 className="text-base font-semibold text-on-surface">Detected Scenes & OCR</h3>
            <span className="text-[11px] text-primary bg-primary-container/10 px-2 py-0.5 rounded">
              OpenCV 5.0
            </span>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1">
            {scenes.map((scene) => {
              const isSelected =
                selectedSceneId === scene.id ||
                (currentTime >= scene.seconds &&
                  currentTime < (scenes[scenes.indexOf(scene) + 1]?.seconds ?? 99999));

              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    onSelectScene(scene);
                    onSeek(scene.seconds);
                  }}
                  className={`p-3 rounded-lg flex gap-3 items-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container/15 border border-primary/50 shadow-md'
                      : 'bg-surface-container border border-outline-variant/20 hover:border-primary/40'
                  }`}
                >
                  <span
                    className={`font-bold text-xs px-2 py-1 rounded shrink-0 font-mono ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {scene.timestamp}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-on-surface truncate">
                      {scene.title}
                    </h5>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      OCR: "{scene.ocrText}"
                    </p>
                  </div>
                  <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                    {scene.confidence}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
