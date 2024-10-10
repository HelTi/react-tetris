"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Controls from './Controls';
import ScoreBoard from './ScoreBoard';
import useGameLogic from './useGameLogic';
import styles from './Game.module.css';
import NextPiece from './NextPiece';

const Game = () => {
  const {
    board,
    score,
    level,
    lines,
    isGameOver,
    currentPiece,
    nextPiece,
    movePiece,
    rotatePiece,
    dropPiece,
    startGame,
    pauseGame,
    isPaused,
  } = useGameLogic();

  const handleKeyPress = useCallback((event) => {
    if (isGameOver || isPaused) return;

    switch (event.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        dropPiece();
        break;
      default:
        break;
    }
  }, [isGameOver, isPaused, movePiece, rotatePiece, dropPiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className={`flex gap-4`}>
      <div className="">
        <Board board={board} currentPiece={currentPiece} />
        <Controls
          onStart={startGame}
          onPause={pauseGame}
          isPaused={isPaused}
          isGameOver={isGameOver}
        />
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <ScoreBoard score={score} level={level} lines={lines} />
          <div className={styles.nextPiece}>
            <NextPiece piece={nextPiece} />
          </div>
          <div className={styles.instructions}>
            <h3>操作说明</h3>
            <ul className='text-gray-500'>
              <li>← : 左移</li>
              <li>→ : 右移</li>
              <li>↓ : 加速下落</li>
              <li>↑ : 旋转</li>
              <li>空格 : 直接下落</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Game;
