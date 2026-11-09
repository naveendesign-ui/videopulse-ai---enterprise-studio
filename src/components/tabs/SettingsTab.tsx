import React, { useState } from 'react';
import { AppSettings } from '../../types';

interface SettingsTabProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg max-w-3xl">
        <h2 className="text-xl font-bold text-on-surface mb-1">Workspace Settings</h2>
        <p className="text-xs text-on-surface-variant mb-space-lg">
          Configure AI model weights, API keys, GPU clusters, and enterprise Slack webhooks.
        </p>

        {savedMessage && (
          <div className="bg-secondary/20 border border-secondary/40 text-secondary text-xs px-4 py-2.5 rounded-lg mb-space-md flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Settings saved successfully to enterprise configuration store!
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
          {/* API Key */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-on-surface">
                OpenAI / Whisper API Key
              </label>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">
                  {showApiKey ? 'visibility_off' : 'visibility'}
                </span>
                {showApiKey ? 'Hide Key' : 'Reveal Key'}
              </button>
            </div>
            <input
              className="bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:outline-none font-mono"
              type={showApiKey ? 'text' : 'password'}
              value={formData.whisperApiKey}
              onChange={(e) => setFormData({ ...formData, whisperApiKey: e.target.value })}
            />
          </div>

          {/* Model Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Default Transcription Model
            </label>
            <select
              className="bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            >
              <option>OpenAI Whisper large-v3 (Recommended)</option>
              <option>Whisper large-v3 turbo</option>
              <option>Whisper medium.en</option>
              <option>Custom Fine-Tuned Enterprise Model v2</option>
            </select>
          </div>

          {/* GPU Acceleration Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
            <div>
              <h4 className="text-xs font-semibold text-on-surface">
                GPU Acceleration (CUDA / TensorRT)
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Utilize NVIDIA A100 clusters for sub-150ms real-time video parsing and OCR inference.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.gpuAcceleration}
                onChange={(e) => setFormData({ ...formData, gpuAcceleration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Slack Webhook */}
          <div className="flex flex-col gap-1.5 pt-4 border-t border-outline-variant/30">
            <label className="text-xs font-semibold text-on-surface">
              Enterprise Slack Webhook URL
            </label>
            <input
              className="bg-surface-container border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface focus:border-primary focus:outline-none font-mono"
              type="text"
              value={formData.slackWebhookUrl}
              onChange={(e) => setFormData({ ...formData, slackWebhookUrl: e.target.value })}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg text-xs shadow-lg shadow-primary/20 hover:bg-primary-fixed-dim transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
