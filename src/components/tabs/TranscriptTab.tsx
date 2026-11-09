import React, { useState } from 'react';
import { TranscriptLine } from '../../types';
import { filterTranscript, generateSrt, generateVtt } from '../../utils/videoAnalytics';

interface TranscriptTabProps {
  transcript: TranscriptLine[];
  currentTime: number;
  onSeek: (seconds: number) => void;
  onNavigateToVideo: () => void;
}

export const TranscriptTab: React.FC<TranscriptTabProps> = ({
  transcript,
  currentTime,
  onSeek,
  onNavigateToVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredLines = filterTranscript(transcript, searchQuery, selectedSpeaker);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportSrt = () => {
    const srtData = generateSrt(transcript);
    const blob = new Blob([srtData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VideoPulse_Transcript_Q4.srt';
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('SubRip (.srt) subtitle file exported successfully!');
  };

  const handleExportVtt = () => {
    const vttData = generateVtt(transcript);
    const blob = new Blob([vttData], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VideoPulse_Transcript_Q4.vtt';
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('WebVTT (.vtt) file exported successfully!');
  };

  const handleCopyTranscript = () => {
    const fullText = transcript.map((l) => `[${l.timestamp}] ${l.speaker}: ${l.text}`).join('\n\n');
    navigator.clipboard?.writeText(fullText);
    triggerToast('Full transcript copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg flex flex-col gap-space-md">
        {/* Header & Export Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Timestamped Transcript Explorer</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Click any line to jump directly to playback position. Diarized via Whisper large-v3.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyTranscript}
              className="bg-surface-container-high border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-surface-bright transition-colors"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span> Copy All
            </button>
            <button
              onClick={handleExportSrt}
              className="bg-surface-container-high border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-surface-bright transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span> Export SRT
            </button>
            <button
              onClick={handleExportVtt}
              className="bg-surface-container-high border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-surface-bright transition-colors"
            >
              <span className="material-symbols-outlined text-sm">subtitles</span> Export VTT
            </button>
            <button
              onClick={onNavigateToVideo}
              className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-primary-fixed-dim transition-colors"
            >
              <span className="material-symbols-outlined text-sm">play_circle</span> Jump to Player
            </button>
          </div>
        </div>

        {/* Search & Speaker Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-surface-container/60 p-3 rounded-lg border border-outline-variant/20">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full bg-surface border border-outline-variant/40 rounded-lg pl-9 pr-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
              placeholder="Search transcript phrases, words, numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-on-surface-variant shrink-0 mr-1">Speaker:</span>
            {['All', 'Elena Vance', 'Marcus Chen', 'Sarah Jenkins'].map((spk) => (
              <button
                key={spk}
                onClick={() => setSelectedSpeaker(spk)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedSpeaker === spk
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {spk}
              </button>
            ))}
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-primary-container/20 border border-primary/40 text-primary text-xs px-4 py-2 rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Transcript Stream */}
        <div className="flex flex-col gap-3 bg-surface-container p-space-md rounded-xl border border-outline-variant/20 max-h-[600px] overflow-y-auto">
          {filteredLines.length === 0 ? (
            <div className="text-center py-10 text-xs text-on-surface-variant">
              No transcript lines match your search criteria.
            </div>
          ) : (
            filteredLines.map((line, idx) => {
              const isCurrent =
                currentTime >= line.seconds &&
                currentTime < (transcript[transcript.indexOf(line) + 1]?.seconds ?? 99999);

              const speakerColorClass =
                line.speakerColor === 'secondary'
                  ? 'text-secondary'
                  : line.speakerColor === 'tertiary'
                  ? 'text-tertiary'
                  : 'text-primary';

              return (
                <div
                  key={line.id}
                  onClick={() => onSeek(line.seconds)}
                  className={`flex gap-4 p-3 rounded-lg transition-all cursor-pointer select-text ${
                    isCurrent
                      ? 'bg-primary-container/15 border border-primary/40 shadow-sm'
                      : 'hover:bg-surface-bright/70 border border-transparent'
                  }`}
                >
                  <span
                    className={`font-mono font-bold text-xs shrink-0 pt-0.5 ${
                      isCurrent ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {line.timestamp}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${speakerColorClass}`}>
                        {line.speaker}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-primary bg-primary/20 px-1.5 py-0.2 rounded font-mono font-semibold animate-pulse">
                          PLAYING
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-on-surface mt-1 leading-relaxed">
                      {line.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
