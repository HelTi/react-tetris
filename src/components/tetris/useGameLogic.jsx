import { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 1 },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 2 },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 3 },
  O: { shape: [[1, 1], [1, 1]], color: 4 },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 5 },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 6 },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 7 },
};

const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

const generateNewPiece = () => {
  const pieces = Object.keys(TETROMINOS);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    ...TETROMINOS[randomPiece],
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0,
  };
}

const useGameLogic = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(() => generateNewPiece());
  const [nextPiece, setNextPiece] = useState(() => generateNewPiece());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);



  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(generateNewPiece());
    setNextPiece(generateNewPiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setIsGameOver(false);
    setIsPaused(false);
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const isColliding = useCallback((piece, board) => {
    if (!piece || !piece.shape) {
      console.error('Invalid piece in isColliding:', piece);
      return true; // 如果piece无效，认为是碰撞
    }
    for (let y = 0; y < piece.shape.length; y++) {
      if (!Array.isArray(piece.shape[y])) {
        console.error('Invalid piece shape row:', piece.shape[y]);
        return true; // 如果形状行无效，认为是碰撞
      }

      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          if (
            piece.y + y >= BOARD_HEIGHT ||
            piece.x + x < 0 ||
            piece.x + x >= BOARD_WIDTH ||
            (board[piece.y + y] && board[piece.y + y][piece.x + x] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const movePiece = useCallback((dx, dy) => {
    if (isGameOver || isPaused) return;

    setCurrentPiece((prev) => {
      if (!prev) {
        console.error('Current piece is null in movePiece');
        return null;
      }
      const newPiece = { ...prev, x: prev.x + dx, y: prev.y + dy };
      if (isColliding(newPiece, board)) {
        if (dy > 0) {
          // Piece has landed
          const newBoard = board.map((row) => [...row]);
          for (let y = 0; y < prev.shape.length; y++) {
            for (let x = 0; x < prev.shape[y].length; x++) {
              if (prev.shape[y][x] !== 0) {
                newBoard[prev.y + y][prev.x + x] = prev.color;
              }
            }
          }
          setBoard(newBoard);
          setCurrentPiece(nextPiece);
          setNextPiece(generateNewPiece());

          // Check for completed lines
          const completedLines = newBoard.reduce((acc, row, index) => {
            if (row.every((cell) => cell !== 0)) {
              acc.push(index);
            }
            return acc;
          }, []);

          if (completedLines.length > 0) {
            const updatedBoard = newBoard.filter((_, index) => !completedLines.includes(index));
            const emptyRows = Array.from({ length: completedLines.length }, () => Array(BOARD_WIDTH).fill(0));
            setBoard([...emptyRows, ...updatedBoard]);

            // Update lines and score
            const newLines = lines + completedLines.length;
            setLines(newLines);
            setScore((prev) => prev + completedLines.length * 100 * level);
            setLevel(Math.floor(newLines / 10) + 1);
          }

          // Check for game over
          if (isColliding(nextPiece, newBoard)) {
            setIsGameOver(true);
          }
        }
        return prev;
      }
      return newPiece;
    });
  }, [board, isGameOver, isPaused, isColliding, nextPiece, level, lines]);

  const rotatePiece = useCallback(() => {
    if (isGameOver || isPaused) return;

    setCurrentPiece((prev) => {
      if (!prev || !prev.shape) {
        console.error('Invalid current piece in rotatePiece:', prev);
        return prev;
      }
      const rotatedShape = prev.shape[0].map((_, index) =>
        prev.shape.map((row) => row[index]).reverse()
      );
      const newPiece = { ...prev, shape: rotatedShape };
      if (isColliding(newPiece, board)) {
        return prev;
      }
      return newPiece;
    });
  }, [board, isGameOver, isPaused, isColliding]);

  const dropPiece = useCallback(() => {
    if (isGameOver || isPaused || !currentPiece) return;

    let newY = currentPiece.y;
    while (!isColliding({ ...currentPiece, y: newY + 1 }, board)) {
      newY++;
    }
    movePiece(0, newY - currentPiece.y);
  }, [board, currentPiece, isGameOver, isPaused, isColliding, movePiece]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      movePiece(0, 1);
    }, INITIAL_SPEED / level);

    return () => {
      clearInterval(gameLoop);
    };
  }, [isGameOver, isPaused, level, movePiece]);

  return {
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
  };
};

export default useGameLogic;
