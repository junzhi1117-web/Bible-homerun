
import React from 'react';
import type { Question } from '../types';

interface QuestionListModalProps {
  questions: Question[];
  onClose: () => void;
}

const hitTypeInfo: { [key: string]: { text: string; className: string } } = {
  '1B': { text: '一壘', className: 'bg-blue-600' },
  '2B': { text: '二壘', className: 'bg-green-600' },
  '3B': { text: '三壘', className: 'bg-orange-600' },
  'HR': { text: '全壘打', className: 'bg-red-700' },
};

const QuestionListModal: React.FC<QuestionListModalProps> = ({ questions, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] mx-auto flex flex-col overflow-hidden border border-gray-200 animate-slide-in-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-3 sm:p-4 text-gray-700 text-center bg-gray-100 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-2xl font-bold">完整題庫 (Full Question Bank)</h2>
        </header>

        <main className="p-4 sm:p-8 flex-grow text-gray-800 overflow-y-auto">
          <ul className="space-y-3">
            {questions.map((q) => (
              <li key={q.id} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <span className={`flex-shrink-0 w-full sm:w-20 text-center text-white font-bold py-1 px-2 rounded-md text-sm ${hitTypeInfo[q.type].className}`}>
                  {hitTypeInfo[q.type].text}
                </span>
                <p className="flex-1 text-gray-700 text-sm sm:text-base leading-relaxed">{q.question}</p>
              </li>
            ))}
          </ul>
        </main>

        <footer className="p-4 bg-gray-100 border-t border-gray-200 flex-shrink-0 text-center">
            <button 
              onClick={onClose}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-8 rounded-lg transition-transform transform active:scale-95"
            >
              關閉
            </button>
        </footer>
      </div>
       <style>{`
        @keyframes fade-in-backdrop { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-backdrop { animation: fade-in-backdrop 0.3s ease-out forwards; }
        @keyframes slide-in-modal { from { opacity: 0; transform: translateY(-30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-in-modal { animation: slide-in-modal 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default QuestionListModal;
