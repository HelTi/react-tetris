import React from 'react';
import styles from './Controls.module.css';

const Controls = ({ onStart, onPause, isPaused, isGameOver }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      {isGameOver ? (
        <div
          onClick={onStart}
          className="px-6 text-center py-2 cursor-pointer w-full bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-300"
        >
          开始新游戏
        </div>
      ) : (
        <div
          onClick={onPause}
          className={`px-6 py-2 text-center cursor-pointer w-full ${isPaused ? 'bg-green-500' : 'bg-yellow-500'} text-white font-semibold rounded-lg shadow-md hover:${isPaused ? 'bg-green-600' : 'bg-yellow-600'} focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isPaused ? 'focus:ring-green-400' : 'focus:ring-yellow-400'} transition-colors duration-300`}
        >
          {isPaused ? '继续' : '暂停'}
        </div>
      )}
    </div>
  );
};

export default Controls;
