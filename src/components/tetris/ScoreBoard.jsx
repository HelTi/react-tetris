import React from 'react';
import styles from './ScoreBoard.module.css';

const ScoreBoard = ({ score, level, lines }) => {
  return (
    <div className={styles.scoreBoard}>
      <h2>得分板</h2>
      <p>得分: {score}</p>
      <p>等级: {level}</p>
      <p>消除行数: {lines}</p>
    </div>
  );
};

export default ScoreBoard;
