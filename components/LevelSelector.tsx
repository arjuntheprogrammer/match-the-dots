
import React from 'react';
import { LEVELS } from '../constants';

interface LevelSelectorProps {
  unlockedLevels: number;
  onSelect: (id: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ unlockedLevels, onSelect }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Select Level</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {LEVELS.map((lvl) => {
            const isUnlocked = lvl.id <= unlockedLevels;
            return (
              <button
                key={lvl.id}
                disabled={!isUnlocked}
                onClick={() => onSelect(lvl.id)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-xl font-bold transition-all transform ${
                  isUnlocked 
                  ? 'bg-white text-gray-700 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 border-blue-200' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {isUnlocked ? lvl.id : '🔒'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
