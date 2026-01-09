
import React, { useState, useEffect } from 'react';
import { GameView } from './components/GameView';
import { AuthView } from './components/AuthView';
import { LevelSelector } from './components/LevelSelector';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1);
  const [unlockedPens, setUnlockedPens] = useState<string[]>(['pencil-black']);

  useEffect(() => {
    const saved = localStorage.getItem('match_the_dots_save');
    if (saved) {
      const data = JSON.parse(saved);
      setUnlockedLevels(data.unlockedLevels || 1);
      setUnlockedPens(data.unlockedPens || ['pencil-black']);
      if (data.user) setUser(data.user);
    }
  }, []);

  const saveProgress = (levels: number, pens: string[]) => {
    localStorage.setItem('match_the_dots_save', JSON.stringify({
      unlockedLevels: levels,
      unlockedPens: pens,
      user
    }));
  };

  const handleLogin = (email: string) => {
    setUser({ email });
  };

  const handleLevelComplete = (levelId: number) => {
    const nextLevel = Math.max(unlockedLevels, levelId + 1);
    setUnlockedLevels(nextLevel);
    saveProgress(nextLevel, unlockedPens);
  };

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  if (currentLevel === null) {
    return (
      <LevelSelector 
        unlockedLevels={unlockedLevels} 
        onSelect={(id) => setCurrentLevel(id)} 
        onLogout={() => setUser(null)}
      />
    );
  }

  return (
    <GameView 
      levelId={currentLevel} 
      unlockedPens={unlockedPens}
      onBack={() => setCurrentLevel(null)} 
      onComplete={() => handleLevelComplete(currentLevel)}
    />
  );
};

export default App;
