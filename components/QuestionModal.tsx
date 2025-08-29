
import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import { AnswerResult } from '../App';

interface QuestionModalProps {
  question: Question;
  onClose: () => void;
  onAnswer: (result: AnswerResult) => void;
}

const hitTypeInfo: { [key: string]: { text: string; className: string } } = {
  '1B': { text: '一壘安打', className: 'bg-blue-600' },
  '2B': { text: '二壘安打', className: 'bg-green-600' },
  '3B': { text: '三壘安打', className: 'bg-orange-600' },
  'HR': { text: '全壘打', className: 'bg-red-700' },
};


const QuestionModal: React.FC<QuestionModalProps> = ({ question, onClose, onAnswer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Reset showAnswer state when the question changes
    setShowAnswer(false);
  }, [question]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-2xl mx-auto flex flex-col overflow-hidden border border-gray-200 animate-slide-in-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 text-gray-700 text-center bg-gray-100 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold">問題 #{question.id} - {hitTypeInfo[question.type].text}</h2>
        </header>

        <main className="p-6 sm:p-8 flex-grow text-gray-800">
          <div className="mb-6">
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">{question.question}</p>
          </div>
          
          <div className="text-center mb-6">
            {!showAnswer && (
              <button 
                onClick={() => setShowAnswer(true)}
                className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 border border-gray-300"
              >
                顯示答案
              </button>
            )}
          </div>
          
          {showAnswer && (
            <div className="bg-gray-100 p-4 rounded-lg text-center transition-opacity duration-500 animate-fade-in border border-gray-200">
              <h3 className="text-gray-600 font-bold text-lg mb-2">答案</h3>
              <p className="text-xl sm:text-2xl text-gray-900 font-semibold">{question.answer}</p>
            </div>
          )}
        </main>

        {showAnswer && (
          <footer className="p-4 bg-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-200">
            <button 
              onClick={() => onAnswer('incorrect')}
              className="w-full bg-red-200 hover:bg-red-300 text-red-800 font-bold py-3 px-5 rounded-lg transition-transform transform hover:scale-105"
            >
              答錯 (出局)
            </button>
            <button 
              onClick={() => onAnswer('foul')}
              className="w-full bg-amber-200 hover:bg-amber-300 text-amber-800 font-bold py-3 px-5 rounded-lg transition-transform transform hover:scale-105"
            >
              界外球
            </button>
            <button 
              onClick={() => onAnswer('correct')}
              className="w-full bg-green-200 hover:bg-green-300 text-green-800 font-bold py-3 px-5 rounded-lg transition-transform transform hover:scale-105"
            >
              答對 (安打)
            </button>
          </footer>
        )}
      </div>
       <style>{`
        @keyframes fade-in-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-backdrop {
          animation: fade-in-backdrop 0.3s ease-out forwards;
        }
        @keyframes slide-in-modal {
          from { opacity: 0; transform: translateY(-30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-in-modal {
          animation: slide-in-modal 0.4s ease-out forwards;
        }
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

export default QuestionModal;