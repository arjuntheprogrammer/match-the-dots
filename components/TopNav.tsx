import React, { useEffect, useRef, useState } from 'react';
import { type AuthUser } from '../services/apiClient';

interface TopNavProps {
  unlockedLevels: number;
  totalLevels: number;
  user: AuthUser;
  isSyncing: boolean;
  syncError: string | null;
  onSignOut: () => void;
  onLogoClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  unlockedLevels,
  totalLevels,
  user,
  isSyncing,
  syncError,
  onSignOut,
  onLogoClick
}) => {
  const progress = Math.min(unlockedLevels, totalLevels);
  const progressPercent = Math.round((progress / totalLevels) * 100);
  const displayName = user.displayName || user.email || 'Player';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const syncStatus = syncError ?? (isSyncing ? 'Syncing…' : 'Synced');
  const syncClass = syncError ? 'text-rose-300' : isSyncing ? 'text-blue-300' : 'text-emerald-300';
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (dropdownRef.current.contains(event.target as Node)) return;
      setShowProfile(false);
    };

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  return (
    <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800/70">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="grid grid-cols-[1fr,2fr,1fr] items-center gap-4">
          <button
            type="button"
            onClick={onLogoClick}
            className="text-xs uppercase tracking-[0.35em] text-blue-400 hover:text-blue-200 transition-colors text-left"
          >
            Match the Dots
          </button>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>{progress}/{totalLevels}</span>
              <span className={syncClass}>{syncStatus}</span>
            </div>
            <div className="h-2 w-full max-w-sm rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowProfile((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all"
                aria-label="Open profile menu"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="h-10 w-10 rounded-full border border-blue-400 object-cover shadow-lg shadow-blue-500/30"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full border border-blue-400 bg-slate-900 flex items-center justify-center text-xs font-semibold text-blue-200">
                    {initials || 'P'}
                  </div>
                )}
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-700/70 bg-slate-900/95 p-4 shadow-2xl">
                  <div className="flex flex-col items-center text-center space-y-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={displayName}
                        className="h-14 w-14 rounded-full border border-blue-500/40 object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full border border-blue-500/40 bg-slate-800 flex items-center justify-center text-sm font-semibold text-blue-200">
                        {initials || 'P'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{displayName}</p>
                      {user.email && <p className="text-xs text-slate-400 truncate w-full">{user.email}</p>}
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setShowProfile(false);
                      }}
                      className="w-full rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
