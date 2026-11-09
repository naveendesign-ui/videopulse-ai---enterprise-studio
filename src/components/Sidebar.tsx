import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenNewBatchModal: () => void;
}

interface NavItem {
  name: AppTab;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Upload Video', icon: 'upload' },
  { name: 'Video Analysis', icon: 'analytics' },
  { name: 'Transcript', icon: 'description' },
  { name: 'AI Summary', icon: 'auto_awesome' },
  { name: 'Highlights', icon: 'movie_filter' },
  { name: 'Analytics', icon: 'bar_chart' },
  { name: 'History', icon: 'history' },
  { name: 'Settings', icon: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewBatchModal,
}) => {
  return (
    <nav className="bg-surface-container-low border-r border-outline-variant/30 flex flex-col justify-between h-full p-space-md w-64 shrink-0 select-none">
      <div className="flex flex-col gap-space-sm">
        {/* Workspace Info */}
        <div className="flex items-center gap-space-sm p-space-sm mb-space-sm bg-surface-container rounded-lg border border-outline-variant/20">
          <div className="w-9 h-9 rounded bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              domain
            </span>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-on-surface truncate">Enterprise Studio</h4>
            <p className="text-xs text-on-surface-variant truncate">AI Video Analytics</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1 nav-links">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onTabChange(item.name)}
                className={`flex items-center gap-3 w-full text-left rounded-lg px-space-md py-space-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-container/20 text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA in Sidebar */}
      <div className="pt-space-md border-t border-outline-variant/30">
        <button
          onClick={onOpenNewBatchModal}
          className="w-full bg-primary text-on-primary font-semibold py-2.5 px-space-md rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Batch
        </button>
      </div>
    </nav>
  );
};
