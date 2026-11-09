import React, { useState, useEffect } from 'react';
import {
  AppTab,
  Highlight,
  NotificationItem,
  PipelineJob,
  Scene,
  AppSettings,
} from './types';
import {
  INITIAL_HIGHLIGHTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PIPELINE_JOBS,
  INITIAL_SCENES,
  INITIAL_SETTINGS,
  INITIAL_TRANSCRIPT,
} from './data/mockData';
import { api, HealthResponse } from './services/api';
import { TopAppBar } from './components/TopAppBar';
import { Sidebar } from './components/Sidebar';
import { NewBatchModal } from './components/NewBatchModal';
import { DashboardTab } from './components/tabs/DashboardTab';
import { UploadVideoTab } from './components/tabs/UploadVideoTab';
import { VideoAnalysisTab } from './components/tabs/VideoAnalysisTab';
import { TranscriptTab } from './components/tabs/TranscriptTab';
import { AiSummaryTab } from './components/tabs/AiSummaryTab';
import { HighlightsTab } from './components/tabs/HighlightsTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { HistoryTab } from './components/tabs/HistoryTab';
import { SettingsTab } from './components/tabs/SettingsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('Dashboard');
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

  // Video playback state - initialized to 04:12 (252 seconds) to match reference design exactly!
  const [currentTime, setCurrentTime] = useState<number>(252);
  const totalDuration = 2712; // 45:12
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>('scene-2');

  // Application data
  const [jobs, setJobs] = useState<PipelineJob[]>(INITIAL_PIPELINE_JOBS);
  const [highlights, setHighlights] = useState<Highlight[]>(INITIAL_HIGHLIGHTS);
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [transcript, setTranscript] = useState(INITIAL_TRANSCRIPT);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Sync with Express backend on mount
  useEffect(() => {
    // 1. Fetch server health
    api
      .getHealth()
      .then((health) => setBackendHealth(health))
      .catch((err) => console.warn('Backend health check error:', err));

    // 2. Fetch server pipelines
    api
      .getPipelines()
      .then((serverJobs) => {
        if (serverJobs && serverJobs.length > 0) {
          setJobs(serverJobs);
        }
      })
      .catch((err) => console.warn('Could not fetch server pipelines:', err));

    // 3. Fetch server settings
    api
      .getSettings()
      .then((serverSettings) => {
        if (serverSettings) setSettings(serverSettings);
      })
      .catch((err) => console.warn('Could not fetch server settings:', err));

    // 4. Polling for live pipeline status updates every 4 seconds
    const pollInterval = setInterval(() => {
      api
        .getPipelines()
        .then((updatedJobs) => {
          if (updatedJobs && updatedJobs.length > 0) {
            setJobs(updatedJobs);
          }
        })
        .catch(() => {});
    }, 4000);

    return () => clearInterval(pollInterval);
  }, []);

  // Playback timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Handler to add a new job via backend API
  const handleJobCreated = (newJob: PipelineJob) => {
    // Optimistic UI update
    setJobs((prev) => [newJob, ...prev]);

    // Send to backend API
    api
      .createPipeline({
        filename: newJob.filename,
        duration: newJob.duration,
        codec: newJob.codec,
      })
      .then((created) => {
        if (created) {
          setJobs((prev) => [created, ...prev.filter((j) => j.id !== newJob.id)]);
        }
      })
      .catch((err) => console.warn('Could not post pipeline to server:', err));

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Batch Dispatched',
      message: `${newJob.filename} queued for multimodal processing.`,
      time: 'Just now',
      type: 'info',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    api.updateSettings(newSettings).catch((err) => console.warn('Could not sync settings to server:', err));
  };

  const handleSelectHighlight = (hl: Highlight) => {
    setCurrentTime(hl.startSeconds);
    setActiveTab('Video Analysis');
    setIsPlaying(true);
  };

  const handleSelectJobFromHistory = (job: PipelineJob) => {
    setActiveTab('Video Analysis');
  };

  return (
    <div className="bg-surface text-on-surface font-sans antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      {/* Top App Bar */}
      <TopAppBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onMarkNotificationRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onClearNotifications={() => setNotifications([])}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Side Navigation Bar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenNewBatchModal={() => setIsNewBatchModalOpen(true)}
        />

        {/* Main Content Workspace Canvas */}
        <main
          className="flex-1 overflow-y-auto bg-surface p-space-lg relative flex flex-col gap-space-lg"
          id="main-canvas"
        >
          {activeTab === 'Dashboard' && (
            <DashboardTab
              jobs={jobs}
              highlights={highlights}
              onNavigateToUpload={() => setActiveTab('Upload Video')}
              onNavigateToAnalysis={() => setActiveTab('Video Analysis')}
              onNavigateToHighlights={() => setActiveTab('Highlights')}
              onSelectHighlight={handleSelectHighlight}
            />
          )}

          {activeTab === 'Upload Video' && (
            <UploadVideoTab
              onJobCreated={handleJobCreated}
              onNavigateToDashboard={() => setActiveTab('Dashboard')}
            />
          )}

          {activeTab === 'Video Analysis' && (
            <VideoAnalysisTab
              currentTime={currentTime}
              totalDuration={totalDuration}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onSeek={(sec) => setCurrentTime(sec)}
              scenes={scenes}
              selectedSceneId={selectedSceneId}
              onSelectScene={(scene) => {
                setSelectedSceneId(scene.id);
                setCurrentTime(scene.seconds);
              }}
            />
          )}

          {activeTab === 'Transcript' && (
            <TranscriptTab
              transcript={transcript}
              currentTime={currentTime}
              onSeek={(sec) => {
                setCurrentTime(sec);
                setActiveTab('Video Analysis');
              }}
              onNavigateToVideo={() => setActiveTab('Video Analysis')}
            />
          )}

          {activeTab === 'AI Summary' && (
            <AiSummaryTab onNavigateToTranscript={() => setActiveTab('Transcript')} />
          )}

          {activeTab === 'Highlights' && (
            <HighlightsTab
              highlights={highlights}
              onPlayHighlight={handleSelectHighlight}
            />
          )}

          {activeTab === 'Analytics' && <AnalyticsTab />}

          {activeTab === 'History' && (
            <HistoryTab jobs={jobs} onSelectJob={handleSelectJobFromHistory} />
          )}

          {activeTab === 'Settings' && (
            <SettingsTab
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>

      {/* New Batch Modal */}
      <NewBatchModal
        isOpen={isNewBatchModalOpen}
        onClose={() => setIsNewBatchModalOpen(false)}
        onStartBatch={handleJobCreated}
      />
    </div>
  );
}
