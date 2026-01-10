
import React, { useState, useEffect, useCallback } from 'react';
import { GameView } from './components/GameView';
import { LevelSelector } from './components/LevelSelector';
import { LEVELS } from './constants';
import { fetchCurrentUser, fetchProgress, saveProgress, signOut, type AuthUser } from './services/apiClient';

const LOCAL_STORAGE_KEY = 'match_the_dots_save';
const DEFAULT_PENS = ['pencil-black'];

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1);
  const [unlockedPens, setUnlockedPens] = useState<string[]>(() => [...DEFAULT_PENS]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [progressReady, setProgressReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const persistLocalProgress = useCallback((levels: number, pens: string[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      unlockedLevels: levels,
      unlockedPens: pens
    }));
  }, []);

  const loadLocalProgress = useCallback(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUnlockedLevels(typeof data.unlockedLevels === 'number' ? data.unlockedLevels : 1);
        setUnlockedPens(
          Array.isArray(data.unlockedPens) && data.unlockedPens.length > 0 ? data.unlockedPens : [...DEFAULT_PENS]
        );
        return;
      } catch (error) {
        console.error('Failed to parse local progress', error);
      }
    }
    setUnlockedLevels(1);
    setUnlockedPens([...DEFAULT_PENS]);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const loadUser = async () => {
      setUserLoading(true);
      setUserError(null);
      try {
        const profile = await fetchCurrentUser();
        if (!isCancelled) {
          setUser(profile);
        }
      } catch (error) {
        console.error('Failed to load user profile', error);
        if (!isCancelled) {
          setUser(null);
          setUserError('We could not verify your session. Please sign in at arjuntheprogrammer.com and reload.');
        }
      } finally {
        if (!isCancelled) {
          setUserLoading(false);
        }
      }
    };

    void loadUser();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProgressReady(false);
      return;
    }

    let isCancelled = false;
    setIsSyncing(true);
    setSyncError(null);
    fetchProgress()
      .then((progress) => {
        if (isCancelled) return;
        setUnlockedLevels(progress.unlockedLevels);
        setUnlockedPens(progress.unlockedPens);
        persistLocalProgress(progress.unlockedLevels, progress.unlockedPens);
      })
      .catch((error) => {
        if (isCancelled) return;
        console.error('Failed to fetch cloud progress', error);
        setSyncError('Unable to load saved progress from Firebase. Using local data instead.');
        loadLocalProgress();
      })
      .finally(() => {
        if (isCancelled) return;
        setIsSyncing(false);
        setProgressReady(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [user, loadLocalProgress, persistLocalProgress]);

  const syncProgressToCloud = useCallback(
    async (levels: number, pens: string[]) => {
      if (!user) return;
      setIsSyncing(true);
      setSyncError(null);
      try {
        await saveProgress({ unlockedLevels: levels, unlockedPens: pens });
      } catch (error) {
        console.error('Failed to sync cloud progress', error);
        setSyncError('Unable to sync progress to Firebase. Your latest progress is stored locally.');
      } finally {
        setIsSyncing(false);
      }
    },
    [user]
  );

  const handleLevelComplete = (levelId: number) => {
    const nextLevel = levelId + 1;
    const updatedUnlocked = Math.max(unlockedLevels, nextLevel);
    setUnlockedLevels(updatedUnlocked);
    persistLocalProgress(updatedUnlocked, unlockedPens);
    void syncProgressToCloud(updatedUnlocked, unlockedPens);
    if (levelId < LEVELS.length) {
      setCurrentLevel(nextLevel);
    } else {
      setCurrentLevel(null);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Failed to sign out', error);
      setAuthError('Unable to sign out right now. Please try again.');
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-400">Checking your session...</p>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-2xl space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-400">Match the Dots</p>
            <h1 className="text-3xl font-semibold">Sign in to continue</h1>
            <p className="text-sm text-slate-300">{userError}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-2xl bg-blue-500/90 hover:bg-blue-400 transition-colors py-3 font-semibold"
            >
              Retry
            </button>
            <a
              href={import.meta.env.DEV ? 'http://localhost:3000/' : 'https://arjuntheprogrammer.com/'}
              className="block text-center rounded-2xl border border-slate-700/70 bg-slate-900/60 py-3 text-sm text-slate-200 hover:border-blue-500/40"
            >
              {import.meta.env.DEV ? 'Go to localhost:3000' : 'Go to arjuntheprogrammer.com'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !progressReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-400">Loading your saved progress...</p>
      </div>
    );
  }

  if (currentLevel === null) {
    return (
      <LevelSelector 
        unlockedLevels={unlockedLevels} 
        onSelect={(id) => setCurrentLevel(id)}
        user={user}
        onSignOut={handleSignOut}
        isSyncing={isSyncing}
        syncError={syncError}
        authError={authError}
      />
    );
  }

  return (
    <div className="relative">
      <GameView 
        levelId={currentLevel} 
        unlockedPens={unlockedPens}
        onBack={() => setCurrentLevel(null)} 
        onComplete={handleLevelComplete}
      />
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end text-xs">
        <button
          onClick={handleSignOut}
          className="rounded-full bg-slate-900/80 border border-slate-600 px-4 py-1 text-white hover:bg-slate-800"
        >
          Sign out
        </button>
        <div
          className={`rounded-full px-4 py-1 text-white transition-colors ${
            syncError
              ? 'bg-rose-900/80 border border-rose-500/40'
              : isSyncing
                ? 'bg-blue-900/80 border border-blue-500/40'
                : 'bg-emerald-900/80 border border-emerald-500/40'
          }`}
        >
          {syncError ? syncError : isSyncing ? 'Syncing progress…' : 'Progress synced'}
        </div>
        {authError && <div className="text-xs text-rose-200 bg-rose-950/60 px-3 py-1 rounded-full">{authError}</div>}
      </div>
    </div>
  );
};

export default App;
