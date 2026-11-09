import React, { useState } from 'react';
import { generateSummaryMarkdown } from '../../utils/videoAnalytics';
import { api } from '../../services/api';

interface AiSummaryTabProps {
  onNavigateToTranscript: () => void;
}

export const AiSummaryTab: React.FC<AiSummaryTabProps> = ({ onNavigateToTranscript }) => {
  const [actionItems, setActionItems] = useState([
    { id: 1, text: 'Deploy cluster auto-scaling for upcoming Q1 enterprise batch uploads.', done: false },
    { id: 2, text: 'Finalize OpenCV 6.0 scene parsing integration for multi-camera streams.', done: true },
    { id: 3, text: 'Schedule technical deep-dive webinar for European enterprise partners.', done: false },
    { id: 4, text: 'Verify zero-retention encryption certificates for enterprise SOC2 compliance.', done: true },
  ]);

  const [slackAlert, setSlackAlert] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [executiveSummaryText, setExecutiveSummaryText] = useState(
    'The Q4 earnings session highlighted record-breaking enterprise growth, driven by proprietary multimodal AI video processing pipelines. Core achievements include lowering latency to 140ms, achieving 99.4% STT accuracy with Whisper v3, and expanding active processing capacity past 1,400 hours.'
  );
  const [aiSource, setAiSource] = useState<string>('Cross-Modal Synthesis');

  const handleRegenerateWithServer = async () => {
    setIsGenerating(true);
    try {
      const res = await api.summarizeTranscript(
        'Dr. Elena Vance: Welcome everyone to the Q4 enterprise earnings call. Today we are thrilled to announce our breakthrough in multimodal video indexing speeds, dropping inference latency down to 140 milliseconds. Marcus Chen: Our transition to Whisper large-v3 combined with custom OpenCV scene parsers has boosted word recognition accuracy to 99.4 percent. Sarah Jenkins: ARR surged past fifty million dollars.'
      );
      if (res.summary) {
        setExecutiveSummaryText(res.summary);
        setAiSource(res.source || 'Server-side Gemini 2.5');
        if (res.keyActionItems && res.keyActionItems.length > 0) {
          setActionItems(res.keyActionItems.map((text, idx) => ({ id: idx + 1, text, done: false })));
        }
        setSlackAlert('AI Executive summary refreshed from backend server!');
        setTimeout(() => setSlackAlert(null), 3000);
      }
    } catch (err) {
      console.warn('Failed to call server AI summarize:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleActionItem = (id: number) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleDownloadMarkdown = () => {
    const md = generateSummaryMarkdown(
      'VideoPulse AI - Executive Q4 Synthesis',
      executiveSummaryText,
      actionItems.map((a) => a.text)
    );
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VideoPulse_Executive_Summary.md';
    a.click();
    URL.revokeObjectURL(url);
    setSlackAlert('Markdown brief downloaded!');
    setTimeout(() => setSlackAlert(null), 3000);
  };

  const handleDownloadJson = () => {
    const data = {
      pipeline: 'VideoPulse Enterprise Studio v4.2',
      session: 'Q4_Earnings_Call_Master_4K.mp4',
      generatedAt: new Date().toISOString(),
      summary: executiveSummaryText,
      actionItems,
      metrics: {
        accuracy: 99.4,
        latencyMs: 140,
        hoursProcessed: 1482,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VideoPulse_Summary_Data.json';
    a.click();
    URL.revokeObjectURL(url);
    setSlackAlert('Structured JSON export generated!');
    setTimeout(() => setSlackAlert(null), 3000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleSendSlack = () => {
    setSlackAlert('Summary successfully dispatched to #enterprise-announcements Slack channel!');
    setTimeout(() => setSlackAlert(null), 4000);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Main Executive AI Summary */}
        <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg flex flex-col gap-space-md">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-bold text-on-surface">Executive AI Summary</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerateWithServer}
                disabled={isGenerating}
                className="bg-surface-container-high hover:bg-surface-bright border border-outline-variant text-on-surface px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors"
                title="Regenerate via server-side AI model"
              >
                <span className={`material-symbols-outlined text-sm text-primary ${isGenerating ? 'animate-spin' : ''}`}>
                  sync
                </span>
                {isGenerating ? 'Synthesizing...' : 'Refresh AI'}
              </button>
              <span className="text-xs text-primary bg-primary-container/10 px-2.5 py-1 rounded-full border border-primary/20">
                {aiSource}
              </span>
            </div>
          </div>

          <div className="bg-surface-container p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span className="text-xs md:text-sm font-semibold">
                Key Takeaways & Synthesized Insights
              </span>
            </div>

            <p className="text-xs md:text-sm text-on-surface leading-relaxed">
              {executiveSummaryText}
            </p>

            {/* Structured Insights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <span className="text-[10px] text-on-surface-variant font-mono uppercase">
                  Revenue Milestone
                </span>
                <p className="text-sm font-bold text-secondary mt-0.5">$50M+ ARR</p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  620 bps margin expansion
                </p>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <span className="text-[10px] text-on-surface-variant font-mono uppercase">
                  Model Latency
                </span>
                <p className="text-sm font-bold text-primary mt-0.5">140ms Latency</p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Sub-second vector query
                </p>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                <span className="text-[10px] text-on-surface-variant font-mono uppercase">
                  Volume Scale
                </span>
                <p className="text-sm font-bold text-tertiary mt-0.5">10,000+ Hrs/Day</p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Zero bottleneck indexing
                </p>
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-on-surface">Key Action Items</h4>
                <span className="text-[11px] text-on-surface-variant">
                  {actionItems.filter((a) => a.done).length} of {actionItems.length} completed
                </span>
              </div>

              <div className="space-y-2 mt-1">
                {actionItems.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => toggleActionItem(item.id)}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 rounded bg-surface border-outline-variant text-primary focus:ring-primary accent-primary pointer-events-none"
                    />
                    <span
                      className={`text-xs md:text-sm leading-snug transition-colors ${
                        item.done
                          ? 'line-through text-on-surface-variant/60'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Export Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-on-surface mb-1">Export Summary</h3>
            <p className="text-xs text-on-surface-variant mb-space-md">
              Download executive summaries in various professional formats.
            </p>

            {slackAlert && (
              <div className="bg-secondary/15 border border-secondary/30 text-secondary text-xs p-3 rounded-lg mb-3 flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {slackAlert}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePrintPdf}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface py-2.5 px-space-md rounded-lg flex items-center justify-between hover:bg-surface-bright transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    picture_as_pdf
                  </span>
                  PDF Executive Report
                </span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  download
                </span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface py-2.5 px-space-md rounded-lg flex items-center justify-between hover:bg-surface-bright transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">
                    description
                  </span>
                  Markdown Brief
                </span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  download
                </span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface py-2.5 px-space-md rounded-lg flex items-center justify-between hover:bg-surface-bright transition-all text-xs font-medium"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-base">code</span>
                  JSON Structured Data
                </span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  download
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/20 mt-space-lg">
            <button
              className="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg text-xs shadow-lg shadow-primary/20 hover:bg-primary-fixed-dim transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              onClick={handleSendSlack}
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Send to Slack Channel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
