import React from 'react';
import styles from './NextPiece.module.css';  // 假设我们为这个组件创建了专门的样式

const NextPiece = ({ piece }) => {
  const renderPiece = () => {
    return piece.shape.map((row, y) => (
      <div key={y} className={styles.row}>
        {row.map((cell, x) => (
          <div
            key={x}
            className={`${styles.cell} ${cell ? styles[`color${piece?.color}`] : ''}`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className={styles.nextPiece}>
      <h3 className='mb-2'>下一个方块</h3>
      {renderPiece()}
    </div>
  );
};

export default NextPiece;
