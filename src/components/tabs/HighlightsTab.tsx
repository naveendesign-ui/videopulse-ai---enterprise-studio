import React, { useState } from 'react';
import { Highlight } from '../../types';

interface HighlightsTabProps {
  highlights: Highlight[];
  onPlayHighlight: (hl: Highlight) => void;
}

export const HighlightsTab: React.FC<HighlightsTabProps> = ({
  highlights,
  onPlayHighlight,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [previewingHl, setPreviewingHl] = useState<Highlight | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const tags = ['All', 'Finance', 'Engineering', 'Strategy'];

  const filteredHighlights =
    selectedTag === 'All'
      ? highlights
      : highlights.filter((h) => h.tag.toLowerCase() === selectedTag.toLowerCase());

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportSingleClip = (hl: Highlight) => {
    showToast(`Clip "${hl.title}" exported in ProRes format (${hl.timeRange})`);
  };

  const handleExportAll = () => {
    showToast(`Exporting ${highlights.length} clips into Enterprise_Clips_Batch.zip...`);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg">
        {/* Header & Export Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-space-lg">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Auto-Generated Highlights Gallery</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              AI-curated viral moments, executive summaries, and key technical segments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAll}
              className="bg-primary text-on-primary font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-primary-fixed-dim transition-all shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">archive</span>
              Export All Clips (ZIP)
            </button>
          </div>
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-2 mb-space-lg border-b border-outline-variant/20 pb-3">
          <span className="text-xs text-on-surface-variant mr-1">Filter by tag:</span>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                selectedTag === t
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {toastMsg && (
          <div className="bg-secondary/20 border border-secondary/40 text-secondary text-xs px-4 py-2.5 rounded-lg mb-space-md flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {toastMsg}
          </div>
        )}

        {/* Highlights Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {filteredHighlights.map((hl) => (
            <div
              key={hl.id}
              className="bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={hl.title}
                    src={hl.thumbnail}
                  />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-primary text-[11px] px-2 py-0.5 rounded font-mono border border-primary/20">
                    {hl.timeRange}
                  </span>
                  <span className="absolute top-2 left-2 bg-surface-container-high/80 backdrop-blur text-on-surface text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {hl.tag}
                  </span>
                </div>

                <div className="p-space-md">
                  <h4 className="text-sm font-semibold text-on-surface">{hl.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Confidence Score: <span className="text-primary font-medium">{hl.score}%</span> • Tag: {hl.tag}
                  </p>
                  <p className="text-[11px] text-on-surface-variant/80 mt-2 line-clamp-2">
                    {hl.description}
                  </p>
                </div>
              </div>

              <div className="p-space-md pt-0 flex gap-2">
                <button
                  onClick={() => setPreviewingHl(hl)}
                  className="flex-1 bg-surface-container-high text-on-surface text-xs py-1.5 rounded border border-outline-variant hover:bg-surface-bright transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={() => onPlayHighlight(hl)}
                  className="flex-1 bg-primary text-on-primary text-xs py-1.5 rounded font-semibold hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">play_arrow</span> Play
                </button>
                <button
                  onClick={() => handleExportSingleClip(hl)}
                  className="p-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface rounded border border-outline-variant"
                  title="Export Clip"
                >
                  <span className="material-symbols-outlined text-xs">download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewingHl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl max-w-xl w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-on-surface">{previewingHl.title}</h3>
                <span className="text-xs text-primary font-mono">{previewingHl.timeRange}</span>
              </div>
              <button
                onClick={() => setPreviewingHl(null)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <img
                src={previewingHl.thumbnail}
                alt={previewingHl.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => {
                    const hl = previewingHl;
                    setPreviewingHl(null);
                    onPlayHighlight(hl);
                  }}
                  className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl">play_arrow</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-on-surface leading-relaxed">{previewingHl.description}</p>

            <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setPreviewingHl(null)}
                className="bg-surface-container-high text-on-surface text-xs px-4 py-2 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const hl = previewingHl;
                  setPreviewingHl(null);
                  onPlayHighlight(hl);
                }}
                className="bg-primary text-on-primary font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xs">smart_display</span> Open in Analysis Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
