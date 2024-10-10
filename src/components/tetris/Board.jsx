import React from 'react';
import styles from './Board.module.css';

const Board = ({ board = [], currentPiece }) => {
  const renderBoard = () => {
    if (!Array.isArray(board) || board.length === 0) {
      return <div className={styles.error}>无效的游戏板数据</div>;
    }

    const renderedBoard = board.map((row, y) => (
      <div key={y} className={styles.row}>
        {row.map((cell, x) => {
          let cellValue = cell;
          if (
            currentPiece &&
            y >= currentPiece.y &&
            y < currentPiece.y + currentPiece.shape.length &&
            x >= currentPiece.x &&
            x < currentPiece.x + currentPiece.shape[0].length
          ) {
            if (currentPiece.shape[y - currentPiece.y][x - currentPiece.x] !== 0) {
              cellValue = currentPiece.shape[y - currentPiece.y][x - currentPiece.x];
            }
          }
          return (
            <div
              key={x}
              className={`${styles.cell} ${styles[`color${cellValue}`]}`}
            />
          );
        })}
      </div>
    ));
    return renderedBoard;
  };

  return <div className={styles.board}>{renderBoard()}</div>;
};

export default Board;
