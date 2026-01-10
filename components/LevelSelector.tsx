
import React from 'react';
import { LEVELS } from '../constants';
import { type AuthUser } from '../services/apiClient';

interface LevelSelectorProps {
  unlockedLevels: number;
  onSelect: (id: number) => void;
  user: AuthUser;
  onSignOut: () => void;
  isSyncing: boolean;
  syncError: string | null;
  authError: string | null;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  unlockedLevels,
  onSelect,
  user,
  onSignOut,
  isSyncing,
  syncError,
  authError
}) => {
  const totalLevels = LEVELS.length;
  const progress = Math.min(unlockedLevels, totalLevels);
  const progressPercent = Math.round((progress / totalLevels) * 100);
  const displayName = user.displayName || user.email || 'Player';
  const syncStatus = syncError ?? (isSyncing ? 'Syncing progress…' : 'Progress synced to Firebase');
  const syncClass = syncError ? 'text-rose-300' : isSyncing ? 'text-blue-300' : 'text-emerald-300';

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-400">Match the Dots</p>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Draw. Bounce. Connect.</h1>
              <p className="text-slate-300 max-w-xl mt-3">
                Sketch lines to guide the blue and red dots into a collision. Each level adds a new twist—balance, timing, and creative ramps.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2">✏️ Draw freely to shape physics.</div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2">🎯 Aim for a single collision.</div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2">🧠 New pens unlock over time.</div>
            </div>
          </div>

          <div className="w-full md:w-72 space-y-4">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-lg">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Progress</span>
                <span className="font-semibold text-blue-300">{progress}/{totalLevels}</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">Keep going to unlock fresh pens and tougher puzzles.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-lg space-y-3">
              <div>
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-white">{displayName}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className={`text-xs ${syncClass}`}>{syncStatus}</span>
                <button
                  onClick={onSignOut}
                  className="inline-flex justify-center rounded-full border border-slate-600 px-4 py-1 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Sign out
                </button>
              </div>
              {authError && <p className="text-xs text-rose-300">{authError}</p>}
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-4 md:p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold">Select Level</h2>
              <p className="text-xs text-slate-400">{totalLevels} handcrafted stages await.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Ready to play
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {LEVELS.map((lvl) => {
              const isUnlocked = lvl.id <= unlockedLevels;
              const isCompleted = lvl.id < unlockedLevels;
                return (
                  <button
                    key={lvl.id}
                    disabled={!isUnlocked}
                    onClick={() => onSelect(lvl.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-base font-semibold transition-all ${
                      isUnlocked
                      ? 'bg-slate-800/80 text-white border border-blue-500/40 shadow hover:shadow-blue-500/20 hover:-translate-y-0.5 hover:border-blue-400/70'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isUnlocked ? (
                      <span className="flex flex-col items-center gap-1">
                        <span className="text-base font-semibold">{lvl.id}</span>
                        {isCompleted && (
                          <span className="text-emerald-400 text-[11px]">✓</span>
                        )}
                      </span>
                    ) : (
                      <span className="flex flex-col items-center gap-1 text-[11px]">
                        <span className="text-sm font-semibold text-slate-400">{lvl.id}</span>
                        <span aria-hidden="true">🔒</span>
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
};
