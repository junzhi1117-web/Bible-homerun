
import React, { useState, useEffect } from 'react';

interface CommentaryBoxProps {
    text: string;
}

const CommentaryBox: React.FC<CommentaryBoxProps> = ({ text }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        setDisplayText(''); 
        if (text) {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 35); // Typing speed in ms
            return () => clearInterval(typingInterval);
        }
    }, [text]);

    return (
        <div className="bg-gray-800 text-white font-sans rounded-lg p-4 text-left shadow-md min-h-[5rem] w-full border-2 border-gray-700">
            <p className="text-base sm:text-lg whitespace-pre-wrap leading-tight">
                {displayText}
                <span className="inline-block w-2 h-5 bg-teal-300 ml-1 animate-pulse" style={{ animationDuration: '1s' }}></span>
            </p>
        </div>
    );
};

export default CommentaryBox;