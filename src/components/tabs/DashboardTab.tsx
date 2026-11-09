import React from 'react';
import { Highlight, PipelineJob } from '../../types';

interface DashboardTabProps {
  jobs: PipelineJob[];
  highlights: Highlight[];
  onNavigateToUpload: () => void;
  onNavigateToAnalysis: () => void;
  onNavigateToHighlights: () => void;
  onSelectHighlight: (hl: Highlight) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  jobs,
  highlights,
  onNavigateToUpload,
  onNavigateToAnalysis,
  onNavigateToHighlights,
  onSelectHighlight,
}) => {
  const activeJobs = jobs.filter((j) => j.status === 'running');
  const primaryJob = activeJobs[0] || jobs[0];

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Top Banner Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-primary-container/10 to-transparent pointer-events-none"></div>
        <div className="z-10">
          <span className="text-xs text-primary font-medium tracking-wide uppercase">
            Operational Overview
          </span>
          <h1 className="text-2xl font-bold text-on-surface mt-1">
            Multimodal Processing Engine Active
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Real-time FFmpeg audio extraction, Whisper large-v3 STT, OpenCV spatial scene parsing, and
            Cross-Attention Multimodal fusion running at peak concurrency.
          </p>
        </div>
        <div className="mt-space-md md:mt-0 z-10 flex flex-wrap gap-space-sm shrink-0">
          <button
            className="bg-primary text-on-primary font-semibold px-4 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2 hover:bg-primary-fixed-dim transition-all shadow-md shadow-primary/20"
            onClick={onNavigateToUpload}
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Process New Video
          </button>
          <button
            className="bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-surface-bright transition-all flex items-center gap-2"
            onClick={onNavigateToAnalysis}
          >
            <span className="material-symbols-outlined text-sm">play_circle</span>
            View Live Stream
          </button>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-lg">
        {/* Metric 1 */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between hover:border-outline-variant/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant text-xs font-medium">Processed Hours</span>
            <span className="material-symbols-outlined text-primary p-2 bg-primary-container/10 rounded-lg">
              schedule
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-on-surface">1,482 hrs</h3>
            <span className="text-xs text-secondary flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-xs">trending_up</span> +14.2% this week
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between hover:border-outline-variant/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant text-xs font-medium">STT Word Accuracy</span>
            <span className="material-symbols-outlined text-secondary p-2 bg-secondary-container/10 rounded-lg">
              mic
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-on-surface">99.4%</h3>
            <span className="text-xs text-secondary flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-xs">check_circle</span> Whisper v3 Model
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between hover:border-outline-variant/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant text-xs font-medium">Extracted Highlights</span>
            <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary-container/10 rounded-lg">
              movie_filter
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-on-surface">8,640</h3>
            <span className="text-xs text-tertiary flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-xs">bolt</span> Auto-tagged clips
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex flex-col justify-between hover:border-outline-variant/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant text-xs font-medium">Pipeline Latency</span>
            <span className="material-symbols-outlined text-primary p-2 bg-primary-container/10 rounded-lg">
              bolt
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-on-surface">140ms</h3>
            <span className="text-xs text-primary flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-xs">speed</span> Real-time streaming
            </span>
          </div>
        </div>
      </div>

      {/* Recent Pipelines & Active Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Pipeline Status Tracker */}
        <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-space-md">
              <h3 className="text-base font-semibold text-on-surface flex items-center gap-2">
                Active Processing Pipelines
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              </h3>
              <span className="text-xs text-primary bg-primary-container/10 px-3 py-1 rounded-full border border-primary/20">
                {activeJobs.length} Jobs Running
              </span>
            </div>

            <div className="flex flex-col gap-space-md">
              {jobs.map((job) => {
                const isRunning = job.status === 'running';
                const isQueued = job.status === 'queued';
                const isCompleted = job.status === 'completed';

                return (
                  <div
                    key={job.id}
                    className="bg-surface-container p-space-md rounded-lg border border-outline-variant/20 flex flex-col gap-3 transition-all hover:border-primary/40"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center ${
                            isRunning
                              ? 'bg-primary-container/20 text-primary'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isRunning ? 'smart_display' : isCompleted ? 'check_circle' : 'movie'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-on-surface">{job.filename}</h4>
                          <p className="text-[11px] text-on-surface-variant">
                            Duration: {job.duration} • Codec: {job.codec} • Size: {job.fileSize}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded font-medium ${
                            isRunning
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : isCompleted
                              ? 'bg-secondary/20 text-secondary border border-secondary/30'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          {job.stageName}
                        </span>
                      </div>
                    </div>

                    {/* Progress Steps for Running Jobs */}
                    {isRunning && (
                      <div className="space-y-2 mt-1">
                        <div className="flex justify-between text-xs text-on-surface-variant">
                          <span>Pipeline Progress (Step 4 of 4)</span>
                          <span className="text-primary font-bold">{job.progress}%</span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-secondary to-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-on-surface-variant">
                          {job.steps.map((step, idx) => (
                            <span
                              key={idx}
                              className={`flex items-center gap-1 ${
                                step.status === 'completed'
                                  ? 'text-primary'
                                  : step.status === 'running'
                                  ? 'text-primary font-bold animate-pulse'
                                  : 'text-on-surface-variant/60'
                              }`}
                            >
                              <span className="material-symbols-outlined text-xs">
                                {step.status === 'completed' ? 'check' : step.status === 'running' ? 'sync' : 'schedule'}
                              </span>
                              {step.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Highlights Widget */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-space-md">
              <h3 className="text-base font-semibold text-on-surface">Top AI Highlights</h3>
              <button
                onClick={onNavigateToHighlights}
                className="text-xs text-primary hover:underline font-medium"
              >
                View all ({highlights.length})
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {highlights.slice(0, 3).map((hl) => (
                <div
                  key={hl.id}
                  className="group relative rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container p-3 flex gap-3 items-center hover:border-primary transition-all cursor-pointer"
                  onClick={() => onSelectHighlight(hl)}
                >
                  <div className="w-16 h-12 rounded bg-surface-container-highest shrink-0 relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      alt={hl.title}
                      src={hl.thumbnail}
                    />
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-sm">play_arrow</span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-on-surface truncate">{hl.title}</h5>
                    <span className="text-[11px] text-primary block mt-0.5">
                      {hl.timeRange} • {hl.score}% Score
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center text-xs text-on-surface-variant">
            <span>Real-time indexing: Whisper v3</span>
            <span className="text-secondary font-medium">Sync: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
