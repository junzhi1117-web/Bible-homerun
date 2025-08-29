
import React, { useState, useEffect } from 'react';
import type { LastScoreInfo } from '../types';

interface ScoreboardProps {
  score: { home: number; away: number };
  hits: { home: number; away: number };
  inning: number;
  topOfInning: boolean;
  outs: number;
  lastScore: LastScoreInfo;
  teamNames: { home: string; away: string };
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, hits, inning, topOfInning, outs, lastScore, teamNames }) => {
  const [homeScoreClass, setHomeScoreClass] = useState('');
  const [awayScoreClass, setAwayScoreClass] = useState('');

  useEffect(() => {
    if (lastScore?.runs && lastScore.runs > 0) {
      if (lastScore.team === 'home') {
        setHomeScoreClass('animate-score-light-up');
      } else {
        setAwayScoreClass('animate-score-light-up');
      }

      const timer = setTimeout(() => {
        setHomeScoreClass('');
        setAwayScoreClass('');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [lastScore]);

  return (
    <div className="bg-[#0a3824] rounded-lg p-3 sm:p-4 font-mono text-yellow-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] border-4 border-black/50 w-full">
      <style>{`
        @keyframes score-light-up {
          0%, 100% {
            color: #facc15; /* yellow-400 */
            text-shadow: 0 0 4px #ca8a04; /* yellow-600 */
          }
          50% {
            color: #fefce8; /* yellow-50 */
            text-shadow: 0 0 12px #fef08a, 0 0 6px #fefce8; /* yellow-200, yellow-50 */
          }
        }
        .animate-score-light-up {
          animation: score-light-up 1s ease-in-out;
        }
        .text-glow {
           text-shadow: 0 0 5px rgba(250, 204, 21, 0.7);
        }
      `}</style>
      
      <div className="grid grid-cols-12 gap-2 sm:gap-4">
        
        <div className="col-span-8 space-y-2">
          {/* Header */}
          <div className="grid grid-cols-5 text-sm sm:text-lg text-yellow-400/70">
            <div className="col-span-3">TEAM</div>
            <div className="text-center">R</div>
            <div className="text-center">H</div>
          </div>
          
          {/* Away Team */}
          <div className="grid grid-cols-5 text-xl sm:text-3xl font-bold tracking-wider items-center bg-black/30 p-2 rounded">
            <div className="col-span-3 text-base sm:text-xl truncate flex items-center gap-2">
              <span className={`transition-opacity duration-500 text-glow ${topOfInning ? 'opacity-100' : 'opacity-0'}`}>⚾</span>
              <span title={teamNames.away}>{teamNames.away}</span>
            </div>
            <div className={`text-center text-glow ${awayScoreClass}`}>{score.away}</div>
            <div className="text-center text-glow">{hits.away}</div>
          </div>
          
          {/* Home Team */}
          <div className="grid grid-cols-5 text-xl sm:text-3xl font-bold tracking-wider items-center bg-black/30 p-2 rounded">
            <div className="col-span-3 text-base sm:text-xl truncate flex items-center gap-2">
              <span className={`transition-opacity duration-500 text-glow ${!topOfInning ? 'opacity-100' : 'opacity-0'}`}>⚾</span>
              <span title={teamNames.home}>{teamNames.home}</span>
            </div>
            <div className={`text-center text-glow ${homeScoreClass}`}>{score.home}</div>
            <div className="text-center text-glow">{hits.home}</div>
          </div>
        </div>
        
        <div className="col-span-4 flex flex-col items-center justify-between bg-black/30 p-2 rounded">
          <div className="text-center">
            <h3 className="text-sm sm:text-lg text-yellow-400/70">INNING</h3>
            <div className="flex justify-center items-center text-2xl sm:text-4xl font-bold text-glow">
              <span className={`transition-opacity ${topOfInning ? 'opacity-100' : 'opacity-40'}`}>▲</span>
              <span className="mx-1">{inning}</span>
              <span className={`transition-opacity ${!topOfInning ? 'opacity-100' : 'opacity-40'}`}>▼</span>
            </div>
          </div>
          <div className="text-center w-full">
            <h3 className="text-sm sm:text-lg text-yellow-400/70">OUTS</h3>
            <div className="flex justify-center space-x-2 mt-1">
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-yellow-900 transition-all duration-300 ${outs >= 1 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-black/50'}`}></div>
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-yellow-900 transition-all duration-300 ${outs >= 2 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-black/50'}`}></div>
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-yellow-900 transition-all duration-300 ${outs >= 3 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-black/50'}`}></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Scoreboard;