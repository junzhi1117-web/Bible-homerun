
import React from 'react';
import type { BattingStrategy } from '../types';

interface StrategyChoiceProps {
  onSelect: (strategy: BattingStrategy) => void;
}

const StrategyChoice: React.FC<StrategyChoiceProps> = ({ onSelect }) => {
  return (
    <div className="text-center p-4 sm:p-8 rounded-lg animate-fade-in w-full max-w-md">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">選擇打擊策略</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
                onClick={() => onSelect('normal')}
                className="flex-1 bg-white hover:bg-teal-50 border-2 border-teal-600 text-teal-800 rounded-lg p-4 shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
                <span className="block text-xl font-bold">普通打擊</span>
                <span className="block text-sm opacity-80">Normal Swing</span>
            </button>
            <button
                onClick={() => onSelect('power')}
                className="flex-1 bg-white hover:bg-red-50 border-2 border-red-600 text-red-800 rounded-lg p-4 shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                <span className="block text-xl font-bold">全力揮擊</span>
                <span className="block text-sm opacity-80">Power Swing</span>
                <p className="text-xs font-semibold mt-1 text-red-700">高風險: 答錯會兩人出局!</p>
            </button>
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default StrategyChoice;
