import React, { useState } from 'react';

export const AnalyticsTab: React.FC = () => {
  const [hoveredBar, setHoveredBar] = useState<{ label: string; value: number } | null>(null);

  const engagementData = [
    { label: '00:00 - 05:00', heightPercent: 40, value: 40, title: 'Introduction & Keynote' },
    { label: '05:00 - 10:00', heightPercent: 65, value: 65, title: 'Quarterly Financials' },
    { label: '10:00 - 15:00', heightPercent: 90, value: 90, title: 'Multimodal Engine Demo (Peak)' },
    { label: '15:00 - 20:00', heightPercent: 75, value: 75, title: 'Architecture Deep Dive' },
    { label: '20:00 - 25:00', heightPercent: 50, value: 50, title: 'Compliance & SOC2' },
    { label: '25:00 - 35:00', heightPercent: 85, value: 85, title: 'Analyst Q&A' },
    { label: '35:00 - 45:00', heightPercent: 95, value: 95, title: 'Closing Milestones (Peak)' },
  ];

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg flex flex-col gap-space-lg">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Engagement & Sentiment Analytics</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time audience sentiment tracking, engagement curves, and speaker balance.
          </p>
        </div>

        {/* Chart Simulation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Viewer Engagement Curve */}
          <div className="bg-surface-container p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-on-surface">Viewer Engagement Curve</h4>
              <span className="text-[11px] text-primary font-mono">
                {hoveredBar ? `${hoveredBar.label}: ${hoveredBar.value}%` : 'Hover bars for details'}
              </span>
            </div>

            <div className="h-64 flex items-end gap-2 pt-6 px-2 bg-surface-container-lowest rounded-lg relative pb-2 select-none">
              {engagementData.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBar({ label: item.label, value: item.value })}
                  onMouseLeave={() => setHoveredBar(null)}
                  className={`flex-1 rounded-t transition-all duration-200 cursor-pointer relative group ${
                    item.value >= 90
                      ? 'bg-primary shadow-[0_0_15px_#4cd7f6]'
                      : item.value >= 70
                      ? 'bg-secondary/80 hover:bg-secondary'
                      : 'bg-primary/40 hover:bg-primary'
                  }`}
                  style={{ height: `${item.heightPercent}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest border border-outline-variant text-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {item.value}% • {item.title}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[11px] text-on-surface-variant px-1 font-mono">
              <span>00:00</span>
              <span>15:00</span>
              <span>30:00</span>
              <span>45:12</span>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-surface-container p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-4 justify-between">
            <h4 className="text-sm font-semibold text-on-surface">Sentiment Distribution</h4>

            <div className="h-64 flex flex-col justify-center gap-5 px-4 bg-surface-container-lowest rounded-lg">
              <div>
                <div className="flex justify-between text-xs mb-1 text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Positive / Enthusiastic
                  </span>
                  <span className="text-secondary font-bold">78%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[78%] transition-all duration-500"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> Neutral / Informational
                  </span>
                  <span className="text-primary font-bold">18%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[18%] transition-all duration-500"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span> Critical / Inquiry
                  </span>
                  <span className="text-tertiary font-bold">4%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full w-[4%] transition-all duration-500"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-on-surface-variant pt-1">
              <span>Sample size: 45:12 audio segment</span>
              <span className="text-secondary font-medium">Confidence: 99.4%</span>
            </div>
          </div>
        </div>

        {/* Speaker Airtime Distribution */}
        <div className="bg-surface-container p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-on-surface">Speaker Airtime & Diarization Ratio</h4>
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-surface-container-highest">
            <div className="bg-secondary h-full w-[48%]" title="Dr. Elena Vance (48%)"></div>
            <div className="bg-tertiary h-full w-[32%]" title="Marcus Chen (32%)"></div>
            <div className="bg-primary h-full w-[20%]" title="Sarah Jenkins (20%)"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span className="text-xs text-on-surface">Dr. Elena Vance: <strong className="text-secondary">48%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-tertiary"></span>
              <span className="text-xs text-on-surface">Marcus Chen: <strong className="text-tertiary">32%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-xs text-on-surface">Sarah Jenkins: <strong className="text-primary">20%</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
