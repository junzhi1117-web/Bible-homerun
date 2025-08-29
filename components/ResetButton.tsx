import React from 'react';

interface ResetButtonProps {
    onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
    return (
        <div className="-mt-4 text-center">
            <button
                onClick={onReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
                重置遊戲 (Reset Game)
            </button>
        </div>
    );
};

export default ResetButton;