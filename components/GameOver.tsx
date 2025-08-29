
import React from 'react';

interface GameOverProps {
    finalCommentary: string;
    onPlayAgain: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ finalCommentary, onPlayAgain }) => {
    return (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center rounded-lg z-20 animate-fade-in">
            <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-lg m-4">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">比賽結束！</h2>
                <p className="text-xl text-gray-600 mb-8">{finalCommentary}</p>
                <button
                    onClick={onPlayAgain}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-md text-xl transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    再玩一局 (Play Again)
                </button>
            </div>
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
              }
            `}</style>
        </div>
    );
};

export default GameOver;