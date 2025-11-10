import React, { useState, useMemo } from 'react';
import type { Question, HitType } from '../types';

interface QuestionListModalProps {
  questions: Question[];
  onClose: () => void;
}

const hitTypeInfo: { [key: string]: { text: string; fullText: string; className: string } } = {
  '1B': { text: '一壘', fullText: '一壘安打', className: 'bg-blue-600' },
  '2B': { text: '二壘', fullText: '二壘安打', className: 'bg-green-600' },
  '3B': { text: '三壘', fullText: '三壘安打', className: 'bg-orange-600' },
  'HR': { text: '全壘打', fullText: '全壘打', className: 'bg-red-700' },
};

const QuestionListModal: React.FC<QuestionListModalProps> = ({ questions, onClose }) => {
  const [selectedType, setSelectedType] = useState<HitType | 'all'>('all');

  const filteredQuestions = useMemo(() => {
    if (selectedType === 'all') return questions;
    return questions.filter(q => q.type === selectedType);
  }, [questions, selectedType]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: questions.length };
    questions.forEach(q => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    return counts;
  }, [questions]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] mx-auto flex flex-col overflow-hidden border border-gray-200 animate-slide-in-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 text-gray-700 bg-gray-100 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">完整題庫 (Full Question Bank)</h2>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedType === 'all'
                  ? 'bg-gray-700 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({categoryCounts.all})
            </button>
            {(['1B', '2B', '3B', 'HR'] as HitType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${
                  hitTypeInfo[type].className
                } ${
                  selectedType === type
                    ? 'shadow-md scale-105 ring-2 ring-offset-2 ring-gray-400'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                {hitTypeInfo[type].fullText} ({categoryCounts[type] || 0})
              </button>
            ))}
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-grow text-gray-800 overflow-y-auto">
          <div className="mb-4 text-center text-sm text-gray-600">
            顯示 {filteredQuestions.length} 題
          </div>
          <ul className="space-y-4">
            {filteredQuestions.map((q) => (
              <li key={q.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-start gap-4 p-4">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-500">#{q.id}</span>
                    <span className={`w-20 text-center text-white font-bold py-1 px-2 rounded-md text-sm ${hitTypeInfo[q.type].className}`}>
                      {hitTypeInfo[q.type].text}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-gray-800 text-base font-medium leading-relaxed">{q.question}</p>
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                      <p className="text-sm text-gray-600 mb-1"><span className="font-semibold text-green-700">答案：</span></p>
                      <p className="text-base text-gray-800">{q.answer}</p>
                    </div>
                    {q.reference && (
                      <div className="flex items-center gap-2 text-sm text-teal-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <span className="font-medium">{q.reference}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </main>

        <footer className="p-4 bg-gray-100 border-t border-gray-200 flex-shrink-0 text-center">
            <button 
              onClick={onClose}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-8 rounded-lg transition-transform transform hover:scale-105"
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
