
import React, { useState } from 'react';
import { RunnerIcon, availableIcons } from './RunnerIcon';
import type { RunnerIconType, TeamIcons } from '../types';

interface TeamNameInputProps {
  onStartGame: (details: { names: { away: string; home: string }, icons: TeamIcons }) => void;
}

const TeamNameInput: React.FC<TeamNameInputProps> = ({ onStartGame }) => {
  const [awayName, setAwayName] = useState('客隊 (Away)');
  const [homeName, setHomeName] = useState('主隊 (Home)');
  const [awayIcon, setAwayIcon] = useState<RunnerIconType>('blue');
  const [homeIcon, setHomeIcon] = useState<RunnerIconType>('red');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({
      names: {
        away: awayName.trim() || '客隊 (Away)',
        home: homeName.trim() || '主隊 (Home)',
      },
      icons: {
        away: awayIcon,
        home: homeIcon,
      }
    });
  };

  const IconSelector: React.FC<{ label: string; selectedIcon: RunnerIconType; onSelect: (icon: RunnerIconType) => void; disabledIcon?: RunnerIconType }> = ({ label, selectedIcon, onSelect, disabledIcon }) => (
    <div>
      <label className="block text-lg font-medium text-gray-500 mb-2">{label}</label>
      <div className="flex items-center justify-center space-x-3 p-2 bg-gray-200/50 rounded-lg">
        {availableIcons.map(icon => {
          const isSelected = selectedIcon === icon;
          const isDisabled = disabledIcon === icon;
          return (
            <button
              type="button"
              key={icon}
              onClick={() => !isDisabled && onSelect(icon)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${isSelected ? 'ring-4 ring-teal-400' : 'ring-2 ring-transparent'} ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-300/50'}`}
              disabled={isDisabled}
              aria-label={`Select ${icon} icon`}
            >
              <div className="w-8 h-8">
                <RunnerIcon iconId={icon} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg mx-auto p-8 border border-gray-200 text-gray-800"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider text-gray-800 text-center mb-4">
          聖經全壘打
        </h1>
        <h2 className="text-xl text-center text-gray-500 mb-6">設定隊伍</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Away Team */}
          <div className="space-y-3 p-4 rounded-lg bg-white/50 border border-gray-200">
            <label htmlFor="away-name" className="block text-lg font-medium text-gray-600">客隊 (Away)</label>
            <input
              type="text"
              id="away-name"
              value={awayName}
              onChange={(e) => setAwayName(e.target.value)}
              maxLength={12}
              className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
            />
            <IconSelector label="選擇跑者圖示" selectedIcon={awayIcon} onSelect={setAwayIcon} disabledIcon={homeIcon} />
          </div>

          {/* Home Team */}
          <div className="space-y-3 p-4 rounded-lg bg-white/50 border border-gray-200">
            <label htmlFor="home-name" className="block text-lg font-medium text-gray-600">主隊 (Home)</label>
            <input
              type="text"
              id="home-name"
              value={homeName}
              onChange={(e) => setHomeName(e.target.value)}
              maxLength={12}
              className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
            />
             <IconSelector label="選擇跑者圖示" selectedIcon={homeIcon} onSelect={setHomeIcon} disabledIcon={awayIcon} />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md text-xl transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 mt-4"
          >
            開始遊戲 (Start Game)
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamNameInput;