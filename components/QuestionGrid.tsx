
import React, { useMemo } from 'react';
import type { Question } from '../types';

interface QuestionGridProps {
  questions: Question[];
  answeredQuestions: Set<number>;
  onQuestionSelect: (question: Question) => void;
}

// A new, Morandi color palette for the question buttons.
const morandiColorStyles = [
  { class: 'bg-[#B2C2B2] hover:bg-[#A2B2A2] text-white', textColor: 'text-white' },
  { class: 'bg-[#A2B6C5] hover:bg-[#92A6B5] text-white', textColor: 'text-white' },
  { class: 'bg-[#D9C8A8] hover:bg-[#C9B898] text-gray-800', textColor: 'text-gray-800' },
  { class: 'bg-[#E4C9C9] hover:bg-[#D4B9B9] text-gray-800', textColor: 'text-gray-800' },
];

const QuestionGrid: React.FC<QuestionGridProps> = ({ questions, answeredQuestions, onQuestionSelect }) => {
  // useMemo ensures that colors are randomized once and then remain consistent for the session.
  const questionsWithColor = useMemo(() => {
    // Create a color cycle array that's long enough for all questions
    const colorCycle = Array.from({ length: questions.length }, (_, i) => morandiColorStyles[i % morandiColorStyles.length]);
    
    // Shuffle the array to make the color distribution random
    for (let i = colorCycle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colorCycle[i], colorCycle[j]] = [colorCycle[j], colorCycle[i]];
    }
    
    return questions.map((q, index) => ({
      ...q,
      colorClass: colorCycle[index].class,
    }));
  }, [questions]); // Reruns only if the base questions array changes.

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="grid grid-cols-8 gap-2">
        {questionsWithColor.map((q) => {
          const isAnswered = answeredQuestions.has(q.id);
          return (
            <button
              key={q.id}
              onClick={() => onQuestionSelect(q)}
              disabled={isAnswered}
              className={`
                aspect-square w-full rounded-md flex items-center justify-center 
                font-bold text-lg sm:text-xl transition-all duration-200
                ${isAnswered 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60' 
                  : `${q.colorClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transform hover:scale-105`
                }
              `}
              aria-label={`Question ${q.id}`}
            >
              <span>{q.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionGrid;