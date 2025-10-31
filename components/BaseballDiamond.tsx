import React, { useState, useEffect } from 'react';
import type { HitType, LastScoreInfo, TeamIcons } from '../types';
import { RunnerIcon } from './RunnerIcon';

interface BaseballDiamondProps {
  bases: boolean[]; // [1st, 2nd, 3rd]
  animationState: { type: HitType; startBases: boolean[] } | null;
  lastScore: LastScoreInfo;
  isStrikeout: boolean;
  teamIcons: TeamIcons;
  battingTeam: 'away' | 'home';
}

const Base: React.FC<{ active: boolean; position: string }> = ({ active, position }) => (
  <div className={`absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${position}`}>
    <div className={`w-full h-full bg-gray-200 transform rotate-45 rounded-sm transition-all duration-300 ${active ? 'bg-orange-300 scale-110 shadow-md shadow-orange-400/50' : 'bg-white'}`}></div>
  </div>
);

const Runner: React.FC<{ iconId: string; positionClass: string; animationClass?: string; style?: React.CSSProperties }> = ({ iconId, positionClass, animationClass, style }) => (
  <div className={`absolute w-8 h-8 z-20 transform -translate-x-1/2 -translate-y-1/2 ${positionClass} ${animationClass || ''}`} style={style}>
    <RunnerIcon iconId={iconId} />
    {/* Dust cloud effect */}
    {animationClass && animationClass.includes('animate-run') && (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none">
        <div className="dust-cloud"></div>
      </div>
    )}
  </div>
);

const Batter: React.FC<{ iconId: string; animationClass?: string }> = ({ iconId, animationClass }) => (
  <div className={`absolute w-12 h-14 z-30 bottom-[5%] left-1/2 transform -translate-x-1/2 ${animationClass || ''}`} style={{ transformOrigin: '40% 90%' }}>
    {/* Bat Swing Swoosh Effect */}
    {animationClass && animationClass.includes('swing') && (
        <div 
            className="absolute top-0 left-0 w-24 h-24"
            style={{ transform: 'translate(-60%, -60%)' }}
        >
            <div 
                className="w-full h-full border-t-4 border-r-4 border-gray-400/70 rounded-full opacity-0"
                style={{ 
                    animation: 'swing-swoosh 0.7s ease-out forwards',
                    animationDelay: '0.1s',
                    clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' 
                }}
            ></div>
        </div>
    )}
    {/* Bat is drawn first (underneath) */}
    <div className="absolute w-2 h-12 bg-amber-600 rounded-lg top-[10%] left-[20%] transform -rotate-45" style={{ transformOrigin: 'bottom center', boxShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}></div>
    {/* RunnerIcon is drawn on top */}
    <div className="absolute w-10 h-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
       <RunnerIcon iconId={iconId} />
    </div>
  </div>
);

const StaticRunners: React.FC<{ bases: boolean[], iconId: string }> = ({ bases, iconId }) => (
  <>
    {bases[0] && <Runner iconId={iconId} positionClass="top-1/2 right-[5%]" />}
    {bases[1] && <Runner iconId={iconId} positionClass="top-[5%] left-1/2" />}
    {bases[2] && <Runner iconId={iconId} positionClass="left-[5%] top-1/2" />}
  </>
);

const AnimatedRunners: React.FC<{ animationState: { type: HitType; startBases: boolean[] }, iconId: string }> = ({ animationState, iconId }) => {
  const { type, startBases } = animationState;
  const [start1B, start2B, start3B] = startBases;

  const batterAnimation = {
    '1B': 'animate-run-home-to-1b',
    '2B': 'animate-run-home-to-2b',
    '3B': 'animate-run-home-to-3b',
    'HR': 'animate-run-home-to-hr',
  }[type];

  let runner1BAnimation = '';
  if (start1B) {
    runner1BAnimation = {
      '1B': 'animate-run-1b-to-2b',
      '2B': 'animate-run-1b-to-3b',
      '3B': 'animate-run-1b-to-home',
      'HR': 'animate-run-1b-to-home',
    }[type];
  }

  let runner2BAnimation = '';
  if (start2B) {
    runner2BAnimation = {
      '1B': 'animate-run-2b-to-3b',
      '2B': 'animate-run-2b-to-home',
      '3B': 'animate-run-2b-to-home',
      'HR': 'animate-run-2b-to-home',
    }[type];
  }

  let runner3BAnimation = '';
  if (start3B) {
    runner3BAnimation = 'animate-run-3b-to-home';
  }

  return (
    <>
      <Batter iconId={iconId} animationClass="animate-swing" />
      <Runner 
        iconId={iconId}
        positionClass="bottom-[5%] left-1/2" 
        animationClass={batterAnimation}
        style={{ animationDelay: '0.4s', visibility: 'hidden' }}
      />
      {start1B && <Runner iconId={iconId} positionClass="top-1/2 right-[5%]" animationClass={runner1BAnimation} />}
      {start2B && <Runner iconId={iconId} positionClass="top-[5%] left-1/2" animationClass={runner2BAnimation} />}
      {start3B && <Runner iconId={iconId} positionClass="left-[5%] top-1/2" animationClass={runner3BAnimation} />}
    </>
  );
};


const BaseballDiamond: React.FC<BaseballDiamondProps> = ({ bases, animationState, lastScore, isStrikeout, teamIcons, battingTeam }) => {
    const [scoreIndicator, setScoreIndicator] = useState<{ runs: number; key: number } | null>(null);

    useEffect(() => {
        if (lastScore?.runs && lastScore.runs > 0) {
            setScoreIndicator({ runs: lastScore.runs, key: lastScore.key });
        }
    }, [lastScore]);
    
    const currentRunnerIcon = battingTeam === 'away' ? teamIcons.away : teamIcons.home;

  return (
    <div className="bg-green-800 rounded-lg shadow-sm p-4 w-full aspect-square relative border-2 border-green-900 overflow-hidden">
       <style>{`
        /* Score Popup Animation */
        @keyframes score-popup {
          0% { transform: translate(-50%, 10px) scale(0.3); opacity: 0; }
          30% { transform: translate(-50%, -55px) scale(1.2); opacity: 1; }
          50% { transform: translate(-50%, -45px) scale(1.0); opacity: 1; } /* Bounce back */
          80% { transform: translate(-50%, -50px) scale(1.05); opacity: 1; } /* Hold with slight wobble */
          100% { transform: translate(-50%, -70px) scale(0.9); opacity: 0; }
        }
        .animate-score-popup {
          animation: score-popup 1.6s ease-out forwards;
        }

        /* --- Batter & Misc Animations --- */

        /* Batter Swing Animation */
        .animate-swing { animation: swing-bat 0.7s ease-out forwards; }
        @keyframes swing-bat {
          0% { transform: translateX(-50%) rotate(25deg); } /* Ready Stance */
          20% { transform: translateX(-50%) rotate(-40deg); } /* Backswing */
          50% { transform: translateX(-50%) rotate(160deg); } /* Contact */
          100% { transform: translateX(-50%) rotate(250deg); opacity: 0; } /* Follow-through */
        }
        
        /* Bat Swoosh Effect */
        @keyframes swing-swoosh {
            0% { opacity: 0; transform: rotate(-90deg) scale(0.5); }
            50% { opacity: 0.8; }
            100% { opacity: 0; transform: rotate(90deg) scale(1.2); }
        }

        /* Strikeout Batter Animation */
        .animate-strikeout { animation: strike-out 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes strike-out {
          0% { transform: translateX(-50%) rotate(25deg); opacity: 1; }
          20% { transform: translateX(-50%) rotate(-40deg); }
          50% { transform: translateX(-50%) rotate(140deg); } /* Swing and miss */
          70% { transform: translateX(-50%) rotate(130deg) translateY(5px); } /* Stumble */
          80% { opacity: 1; }
          100% { transform: translateX(-50%) rotate(130deg) translateY(5px); opacity: 0; }
        }

        /* Strikeout Text "K" Animation */
        .animate-strikeout-text { animation: strikeout-text-popup 1.5s ease-out forwards; }
        @keyframes strikeout-text-popup {
            0% { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
            30% { transform: translate(-50%, -10px) scale(1.3); opacity: 1; }
            80% { transform: translate(-50%, -10px) scale(1.2); opacity: 1; }
            100% { opacity: 0; }
        }
        
        /* Enhanced Runner Bobbing Animation */
        @keyframes running-bob {
            0% { transform: translateY(0) scaleY(1) scaleX(1); }
            25% { transform: translateY(-3px) scaleY(1.1) scaleX(0.95); }
            50% { transform: translateY(-6px) scaleY(1.15) scaleX(0.9); }
            75% { transform: translateY(-3px) scaleY(1.1) scaleX(0.95); }
            100% { transform: translateY(0) scaleY(1) scaleX(1); }
        }

        /* Dust Cloud Animation */
        .dust-cloud {
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(139, 69, 19, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            animation: dust-puff 0.6s infinite ease-out;
        }

        @keyframes dust-puff {
            0% { transform: scale(0.5); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 0.3; }
            100% { transform: scale(2); opacity: 0; }
        }
        
        /* --- Enhanced Runner Path Animations --- */
        /* Optimized with rotation, better easing, and smoother paths */
        .animate-run-home-to-1b { animation: run-home-to-1b 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-home-to-1b {
          0%   { top: 95%; left: 50%; opacity: 1; visibility: visible; transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
          20%  { transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          80%  { transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          100% { top: 50%; left: 95%; opacity: 1; transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
        }
        .animate-run-home-to-2b { animation: run-home-to-2b 2.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-home-to-2b {
          0%   { top: 95%; left: 50%; opacity: 1; visibility: visible; transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
          10%  { transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          45%  { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          50%  { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          90%  { transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          100% { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
        }
        .animate-run-home-to-3b { animation: run-home-to-3b 2.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-home-to-3b {
          0%   { top: 95%; left: 50%; opacity: 1; visibility: visible; transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
          10%  { transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          30%  { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          35%  { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          63%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          68%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          95%  { transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          100% { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(135deg) scale(1); }
        }
        .animate-run-home-to-hr { animation: run-home-to-hr 3.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-home-to-hr {
          0%   { top: 95%; left: 50%; opacity: 1; visibility: visible; transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
          8%   { transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          23%  { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(-45deg) scale(1.05); }
          27%  { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          48%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          52%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          73%  { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          77%  { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          95%  { top: 95%; left: 50%; transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          100% { top: 95%; left: 50%; opacity: 0; transform: translate(-50%, -50%) rotate(225deg) scale(0.8); }
        }
        .animate-run-1b-to-2b { animation: run-1b-to-2b 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-1b-to-2b {
          0%   { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
          20%  { transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          80%  { transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          100% { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
        }
        .animate-run-1b-to-3b { animation: run-1b-to-3b 2.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-1b-to-3b {
          0%   { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
          10%  { transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          45%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          50%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          90%  { transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          100% { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(135deg) scale(1); }
        }
        .animate-run-1b-to-home { animation: run-1b-to-home 2.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-1b-to-home {
          0%   { top: 50%; left: 95%; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
          10%  { transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          30%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(45deg) scale(1.05); }
          35%  { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          63%  { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          68%  { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          95%  { top: 95%; left: 50%; transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          100% { top: 95%; left: 50%; opacity: 0; transform: translate(-50%, -50%) rotate(225deg) scale(0.8); }
        }
        .animate-run-2b-to-3b { animation: run-2b-to-3b 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-2b-to-3b {
          0%   { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(135deg) scale(1); }
          20%  { transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          80%  { transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          100% { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(135deg) scale(1); }
        }
        .animate-run-2b-to-home { animation: run-2b-to-home 2.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-2b-to-home {
          0%   { top: 5%;  left: 50%; transform: translate(-50%, -50%) rotate(135deg) scale(1); }
          10%  { transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          45%  { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(135deg) scale(1.05); }
          50%  { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          90%  { top: 95%; left: 50%; transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          100% { top: 95%; left: 50%; opacity: 0; transform: translate(-50%, -50%) rotate(225deg) scale(0.8); }
        }
        .animate-run-3b-to-home { animation: run-3b-to-home 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, running-bob 0.25s infinite ease-in-out; }
        @keyframes run-3b-to-home {
          0%   { top: 50%; left: 5%; transform: translate(-50%, -50%) rotate(225deg) scale(1); }
          20%  { transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          80%  { top: 95%; left: 50%; transform: translate(-50%, -50%) rotate(225deg) scale(1.05); }
          100% { top: 95%; left: 50%; opacity: 0; transform: translate(-50%, -50%) rotate(225deg) scale(0.8); }
        }
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-600 to-green-800"></div>
      <div 
        className="absolute top-1/2 left-1/2 w-[90%] h-[90%] bg-yellow-800/80 transform -translate-x-1/2 -translate-y-1/2 rotate-45"
        style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'}}
      ></div>
      <div className="absolute top-1/2 left-1/2 w-[65%] h-[65%] border-2 border-white/60 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-yellow-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/80"></div>

      <div className="w-full h-full relative">
        <Base active={!animationState && bases[0]} position="right-[5%] top-1/2" />
        <Base active={!animationState && bases[1]} position="left-1/2 top-[5%]" />
        <Base active={!animationState && bases[2]} position="left-[5%] top-1/2" />
        
        <div className="absolute w-12 h-12 transform -translate-x-1/2 flex items-center justify-center left-1/2 bottom-[-1.5rem]">
          <div 
            className="w-full h-full bg-white" 
            style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 50% 100%, 0% 50%)'}}
          ></div>
        </div>
        
        {scoreIndicator && (
            <div key={scoreIndicator.key} className="absolute left-1/2 bottom-[15%] transform -translate-x-1/2 text-yellow-300 text-5xl font-black tracking-tighter animate-score-popup z-40" style={{ textShadow: '3px 3px 0 #854d0e' }}>
                +{scoreIndicator.runs}
            </div>
        )}

        {isStrikeout && (
            <div className="absolute left-1/2 bottom-[10%] transform -translate-x-1/2 text-red-400 text-6xl font-black animate-strikeout-text z-40" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                K
            </div>
        )}

        {animationState ? (
          <AnimatedRunners animationState={animationState} iconId={currentRunnerIcon} />
        ) : (
          <>
            <Batter iconId={currentRunnerIcon} animationClass={isStrikeout ? 'animate-strikeout' : ''} />
            <StaticRunners bases={bases} iconId={currentRunnerIcon} />
          </>
        )}
      </div>
    </div>
  );
};

export default BaseballDiamond;