
import React, { useState, useEffect } from 'react';
import { GameView } from './components/GameView';
import { LevelSelector } from './components/LevelSelector';
import { LEVELS } from './constants';

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1);
  const [unlockedPens, setUnlockedPens] = useState<string[]>(['pencil-black']);

  useEffect(() => {
    const saved = localStorage.getItem('match_the_dots_save');
    if (saved) {
      const data = JSON.parse(saved);
      setUnlockedLevels(data.unlockedLevels || 1);
      setUnlockedPens(data.unlockedPens || ['pencil-black']);
    }
  }, []);

  const saveProgress = (levels: number, pens: string[]) => {
    localStorage.setItem('match_the_dots_save', JSON.stringify({
      unlockedLevels: levels,
      unlockedPens: pens
    }));
  };

  const handleLevelComplete = (levelId: number) => {
    const nextLevel = levelId + 1;
    const updatedUnlocked = Math.max(unlockedLevels, nextLevel);
    setUnlockedLevels(updatedUnlocked);
    saveProgress(updatedUnlocked, unlockedPens);
    if (levelId < LEVELS.length) {
      setCurrentLevel(nextLevel);
    } else {
      setCurrentLevel(null);
    }
  };

  if (currentLevel === null) {
    return (
      <LevelSelector 
        unlockedLevels={unlockedLevels} 
        onSelect={(id) => setCurrentLevel(id)}
      />
    );
  }

  return (
    <GameView 
      levelId={currentLevel} 
      unlockedPens={unlockedPens}
      onBack={() => setCurrentLevel(null)} 
      onComplete={handleLevelComplete}
    />
  );
};

export default App;
