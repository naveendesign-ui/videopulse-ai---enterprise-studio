import React, { useState } from 'react';
import { NotificationItem } from '../types';

interface TopAppBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  searchQuery,
  onSearchChange,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-surface border-b border-outline-variant/30 flex justify-between items-center w-full px-space-lg h-16 sticky top-0 z-50">
      {/* Brand & Version */}
      <div className="flex items-center gap-space-md">
        <span className="text-lg font-bold text-on-surface flex items-center gap-space-sm select-none">
          <span
            className="material-symbols-outlined text-primary text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            pulse_alert
          </span>
          VideoPulse AI
        </span>
        <span className="text-xs font-medium bg-surface-container-high px-2.5 py-0.5 rounded-full border border-outline-variant/30 text-primary">
          v4.2 Enterprise
        </span>
      </div>

      {/* Global Search Bar & User Actions */}
      <div className="flex items-center gap-space-lg">
        {/* Search Input */}
        <div className="relative hidden md:block w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-space-md py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none transition-colors"
            placeholder="Search transcripts, entities, models..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 text-on-surface-variant hover:text-on-surface text-xs"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Backend status, Notifications, Profile */}
        <div className="flex items-center gap-space-sm text-on-surface-variant relative">
          <span className="text-xs text-primary font-medium flex items-center gap-1.5 bg-primary-container/10 px-3 py-1 rounded-full border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Backend: Connected
          </span>

          {/* Notifications Button */}
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-surface-bright rounded-lg transition-colors relative text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-surface-container-low border border-outline-variant/40 rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                  <span className="text-sm font-semibold text-on-surface">Notifications</span>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={onClearNotifications}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-on-surface-variant py-4 text-center">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-surface-container border-outline-variant/20 opacity-70'
                            : 'bg-primary-container/10 border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-on-surface">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center font-bold text-xs text-primary overflow-hidden cursor-pointer"
            title="Dr. Alex Rivera (Lead Multimodal AI Engineer)"
          >
            <img
              className="w-full h-full object-cover"
              alt="User avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm5EsyowxDm1h7KvT3oC2haGBn7ARax_qme2YULyf1wChFQpyvS8kmlpwrrSpJ9ztF7KGVBc_d4ZSz5GUrebI4Qy7E6tla9C5rXm-Z-MwFsq9W8VyDFtexycUJ23_8PW6RYtehCyHEfj9ph_5ER1kjXc2ipJaqFNq9-F1mpQj5GPu-L622C3rjHBCB-3OmJz8cohtpmMFHwrElGhUiP3BFj7JybYmwDvqFIfKwwsc"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
