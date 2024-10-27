// components/Tetris.js
import { useState, useEffect } from "react";
import styles from "./Tetris.module.css";
import Image from "next/image";
import Link from "next/link";

const pieces = {
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#50e3e6",
  }, // Gold
  I: { shape: [[1], [1], [1], [1]], color: "#245fdf" }, // Cyan
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#dfad24",
  }, // Green
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#dfd924",
  }, // Red
  L: {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: "#30d338",
  }, // Orange
  J: {
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: "#843dc6",
  }, // Blue
  T: {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: "#f050c3",
  }, // Purple
  C: {
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "#ff6347",
  },
  Square: {
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: "#ffa500",
  }, // 3x3 Full Square Block

  BigR: {
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    color: "#ff4500",
  }, // Big R Block

  SmallR: {
    shape: [
      [1, 1],
      [1, 0],
    ],
    color: "#8b0000",
  }, // Small R Block

  Dot: {
    shape: [[1]],
    color: "#a4f050",
  }, // Single Dot Block

  Rectangle: {
    shape: [
      [1, 1, 0],
      [1, 1, 0],
      [1, 1, 0],
    ],
    color: "#4682b4",
  }, // Rectangle Block
  BigT: {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    color: "#f050c3",
  }, // Custom block (Tomato)
};

// Function to create an empty game board
const createEmptyBoard = () =>
  Array.from({ length: 20 }, () => Array(10).fill([0, ""]));

// Function to get a random piece
const randomPiece = () => {
  const keys = Object.keys(pieces).filter((key) => !['C', 'Square', 'BigR', 'SmallR', 'Dot', 'Rectangle', 'BigT'].includes(key));
  return pieces[keys[Math.floor(Math.random() * keys.length)]];
};


// Function to get the custom piece
const customPiece = () => pieces["C"];

const Tetris = ({userData}) => {
  // const buttonSound = new Audio("/soundEffects/button.mp3");
  // const gameOverSound = new Audio("/soundEffects/gameOver.mp3");
  // const lineClear = new Audio("/soundEffects/lineClear.mp3");

  const [buttonSound, setButtonSound] = useState(null);
  const [gameOverSound, setGameOverSound] = useState(null);
  const [lineClearSound, setLineClearSound] = useState(null);
  const [levelUpSound, setLevelUpSound] = useState(null);
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [user, setUser] = useState(userData)
  const [totalBuilderBucks, setTotalBuilderBucks] = useState(0)


  useEffect(() => {
    if (typeof window !== "undefined") {
      // Audio is only available on the client side
      const button = new Audio("/soundEffects/button.mp3");
      const lineClear = new Audio("/soundEffects/lineClear.mp3");
      const gameOver = new Audio("/soundEffects/gameOver.mp3");
      const levelUp = new Audio("/soundEffects/levelUp.mp3");
      setButtonSound(button);
      setGameOverSound(lineClear);
      setLineClearSound(gameOver);
      setLevelUpSound(levelUp);
      // buttonSound.preload = "auto";
      // gameOverSound.preload = "auto";
      // lineClear.preload = "auto";
    }
  }, []);

  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(randomPiece());
  const [nextPiece, setNextPiece] = useState(randomPiece());
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [clearedLines, setClearedLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [customBlockActive, setCustomBlockActive] = useState(false); // New state to track custom block

  useEffect(() => {
    const initialPiece = randomPiece();
    setCurrentPiece(initialPiece);
    setNextPiece(randomPiece());
  }, []);

  // Calculate drop speed based on level
  const dropSpeed = Math.max(100, 500 - (level - 1) * 50);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        moveDown();
      }
    }, dropSpeed);

    return () => clearInterval(interval);
  }, [board, position, currentPiece, gameOver, dropSpeed]);

  // Check for collision with board edges and other pieces

  const checkCollision = (newPosition, piece = currentPiece.shape) => {
    const { x: xOffset, y: yOffset } = newPosition;

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        // Skip empty cells in the piece
        if (!piece[y][x]) continue;

        const boardX = xOffset + x;
        const boardY = yOffset + y;

        // Check if the piece is out of bounds (left, right, bottom)
        if (boardX < 0 || boardX >= 10 || boardY >= 20) {
          return true;
        }

        // Check if the piece collides with the existing locked pieces on the board
        if (boardY >= 0 && board[boardY][boardX][0] !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  // Move the current piece down
  const moveDown = () => {
    const newPosition = { x: position.x, y: position.y + 1 };
    if (!checkCollision(newPosition)) {
      setPosition(newPosition);
    } else {
      lockPiece();
    }
  };

  // Move the piece left
  const moveLeft = () => {
    const newPosition = { x: position.x - 1, y: position.y };
    if (!checkCollision(newPosition)) {
      setPosition(newPosition);
    }
  };

  // Move the piece right
  const moveRight = () => {
    const newPosition = { x: position.x + 1, y: position.y };
    if (!checkCollision(newPosition)) {
      setPosition(newPosition);
    }
  };

  // Rotate the piece
  const rotatePiece = () => {
    const rotatedPiece = currentPiece.shape[0]
      .map((_, index) => currentPiece.shape.map((row) => row[index]))
      .reverse();

    const newPosition = { x: position.x, y: position.y };

    if (!checkCollision(newPosition, rotatedPiece)) {
      setCurrentPiece({
        ...currentPiece,
        shape: rotatedPiece,
      });
    }
  };

  // Lock the piece in place when it collides
  const lockPiece = () => {
    const updatedBoard = board.map((row, y) =>
      row.map((cell, x) => {
        if (y >= position.y && y < position.y + currentPiece.shape.length) {
          const pieceRow = currentPiece.shape[y - position.y];
          if (x >= position.x && x < position.x + pieceRow.length) {
            const pieceCell = pieceRow[x - position.x];
            return pieceCell ? [pieceCell, currentPiece.color] : cell;
          }
        }
        return cell;
      })
    );
    clearLines(updatedBoard);
    if (position.y <= 0) {
      gameOverSound.play();
      setGameOver(true);
      const newBuilderBucks = calculateBuilderBuck(clearedLines);
      setTotalBuilderBucks(newBuilderBucks)
    } else {
      setCurrentPiece(nextPiece);
      setNextPiece(randomPiece());
      setPosition({ x: 4, y: 0 });
      setCustomBlockActive(false); // Reset custom block state after piece locks
    }
  };

  // Function to calculate builder bucks based on cleared lines
const calculateBuilderBuck = (linesCleared) => {
  let builderBucks = 0;
  
  if (linesCleared > 0) {
    // Example logic: award 1 builder buck per cleared line
    builderBucks = linesCleared;
    
    // Additional logic can be added here based on level or other criteria
  }
  
  return builderBucks;
};

  const triggerCustomBlock = async (blockKey) => {
    console.log(blockKey);
  
    // Mapping of block keys to the user state properties
    const blockMap = {
      BigT: 'tBlock',
      Square: 'squareBlock',
      C: 'cBlock',
      BigR: 'bigRBlock',
      SmallR: 'smallRBlock',
      Dot: 'dotBlock',
      Rectangle: 'rectangleBlock',
    };
  
    const customBlockName = blockMap[blockKey];
  
    // Check if the user has enough of the selected block type
    if (user.customBlocks[customBlockName] > 0) {
      try {
        // Make the request to decrease the custom block count
        const response = await fetch('/api/decreaseBlock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.userId,
            customBlockName: customBlockName,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          console.log(`${customBlockName} count decreased successfully`);
  
          // Update the user's custom block count locally
        //  setUser(data.user)
        setUser(prevUser => ({
          ...prevUser,
          customBlocks: {
            ...prevUser.customBlocks,
            [customBlockName]: prevUser.customBlocks[customBlockName] - 1,
          },
        }));
  
          // Set the selected custom block for the game
          setCurrentPiece(pieces[blockKey]);
          setPosition({ x: 4, y: 0 });
          setCustomBlockActive(true);
        } else {
          console.error(data.message || 'Error updating custom block count');
        }
      } catch (error) {
        console.error('Failed to decrease custom block count:', error);
      }
    } else {
      console.log('Not enough blocks available for', blockKey);
    }
  };
  
  
  
// Clear completed lines and update level
const clearLines = async (updatedBoard) => {
  const newBoard = updatedBoard.filter((row) =>
    row.some((cell) => cell[0] === 0)
  );
  const linesCleared = 20 - newBoard.length;
  
  if (linesCleared > 0) {
    lineClearSound.play();
    
    // Update cleared lines in state
    const totalClearedLines = clearedLines + linesCleared;
    setClearedLines(totalClearedLines);
    
    // Check for level up
    if (totalClearedLines % 10 === 0) {
      levelUpSound.play();
      setLevel(level + 1);
    }
    
    // Add empty rows to the top for cleared lines
    const emptyRows = Array.from({ length: linesCleared }, () =>
      Array(10).fill([0, ""])
    );
    setBoard([...emptyRows, ...newBoard]);
    // Send request to backend to update builderBuck based on lines cleared
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          linesCleared: linesCleared,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`Builder Bucks updated: ${data.builderBuck}`);
        // Optionally, update the local user state if needed
        setUser(prevUser => ({
          ...prevUser,
          builderBuck: data.builderBuck,
        }));
      } else {
        console.error(data.message || 'Error updating Builder Bucks');
      }
    } catch (error) {
      console.error('Failed to update Builder Bucks:', error);
    }

    
  } else {
    setBoard(updatedBoard);
  }
};


  // Handle key presses for piece movement and rotation
  const handleKeyPress = (event) => {
    if (event.key === "ArrowLeft") {
      moveLeft();
    } else if (event.key === "ArrowRight") {
      moveRight();
    } else if (event.key === "ArrowDown") {
      moveDown();
    } else if (event.key === "ArrowUp") {
      rotatePiece();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  // Merge the current piece with the board for rendering
  const renderBoard = () => {
    const tempBoard = board.map((row) => [...row]);

    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardX = position.x + x;
          const boardY = position.y + y;
          if (boardY >= 0 && boardX >= 0 && boardY < 20 && boardX < 10) {
            tempBoard[boardY][boardX] = [cell, currentPiece.color];
          }
        }
      });
    });

    return tempBoard;
  };

  // Render the next piece for preview
  const renderNextPiece = () => {
    const tempBoard = Array.from({ length: 4 }, () => Array(4).fill([0, ""]));

    nextPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          tempBoard[y][x] = [cell, nextPiece.color];
        }
      });
    });

    return tempBoard.map((row, y) =>
      row.map((cell, x) => (
        <div
          key={`${y}-${x}`}
          className={styles.cell}
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: cell[0] ? cell[1] : "#fff",
          }}
        />
      ))
    );
  };

  //   // Trigger custom block to fall
  //   const triggerCustomBlock = () => {
  //     setCurrentPiece(customPiece()); // Set the custom piece as the current one
  //     setPosition({ x: 4, y: 0 }); // Reset position to the top middle
  //   };

  // Restart the game
  const restartGame = () => {
    setGameOver(false);
    setBoard(createEmptyBoard());
    setCurrentPiece(randomPiece());
    setNextPiece(randomPiece());
    setPosition({ x: 4, y: 0 });
    setClearedLines(0);
    setLevel(1);
  };


  // Background Audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const bgMusic = new Audio("/soundEffects/backgroundAudio.mp3");
      bgMusic.loop = true; // Set looping to true so it continues playing
      setBackgroundMusic(bgMusic);
    }
  }, []);

  useEffect(() => {
    if (backgroundMusic && !gameOver) {
      backgroundMusic.play(); // Start the music when the game is not over
      return () => {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      };
    } else if (backgroundMusic && gameOver) {
      backgroundMusic.pause(); // Stop the music on game over
      backgroundMusic.currentTime = 0; // Reset to the beginning
    }
  }, [backgroundMusic, gameOver]);

  // Adjust music speed based on level
  useEffect(() => {
    if (backgroundMusic && !gameOver) {
      backgroundMusic.playbackRate = 1 + (level - 1) * 0.1; // Increase speed by 10% per level
    }
  }, [level, backgroundMusic, gameOver]);





  return (
    <div className={styles.tetris}>
      <div className={styles.header}>
        <Link href={"/"} className={styles.backButton}>Back</Link>
        <div className={styles.headerRight}>
          <h3 className={styles.statHeading}>LINES CLEARED: {clearedLines}</h3>
          <h3 className={styles.statHeading}>LEVEL:{level}</h3>
        </div>
      </div>

      <div className={styles.boardContainer}>
      <div className={styles.customBlockWrapper}>
  <h4 className={styles.customBlockHeading}>Custom Blocks</h4>

  <div className={styles.customBlockContainer} onClick={() => triggerCustomBlock('BigT')}>
    <Image
      className={styles.customBlockImage}
      src={"/images/tBlock.png"}
      width={100}
      height={100}
      alt="T Block"
    />
    <p className={styles.customBlockNumber}>{user && user.customBlocks.tBlock}</p>
  </div>

  <div className={styles.customBlockContainer} onClick={() => triggerCustomBlock('Square')}>
    <Image
      className={styles.customBlockImage}
      src={"/images/squareBlock.png"}
      width={100}
      height={100}
      alt="Full Square Block"
    />
    <p className={styles.customBlockNumber}>{user && user.customBlocks.squareBlock}</p>
  </div>

  <div className={styles.customBlockContainer} onClick={() => triggerCustomBlock('C')}>
    <Image
      className={styles.customBlockImage}
      src={"/images/cBlock.png"}
      width={100}
      height={100}
      alt="C Block"
    />
    <p className={styles.customBlockNumber}>{user && user.customBlocks.cBlock}</p>
  </div>

  <div className={styles.customBlockContainer} onClick={() => triggerCustomBlock('BigR')}>
    <Image
      className={styles.customBlockImage}
      src={"/images/bigRBlock.png"}
      width={100}
      height={100}
      alt="Big R Block"
    />
    <p className={styles.customBlockNumber}>{user && user.customBlocks.bigRBlock}</p>
  </div>

  <div className={styles.customBlockContainer} onClick={() => triggerCustomBlock('SmallR')}>
    <Image
      className={styles.customBlockImage}
      src={"/images/smallRBlock.png"}
      width={100}
      height={100}
      alt="Small R Block"
    />
    <p className={styles.customBlockNumber}>{user && user.customBlocks.smallRBlock}</p>
  </div>

  <div className={styles.customBlockContainer} onClick={() => triggerCustomBlock('Dot')}>
    <Image
      className={styles.customBlockImage}
      src={"/images/dotBlock.png"}
      width={100}
      height={100}
      alt="Dot Block"
    />
    <p className={styles.customBlockNumber}>{user && user.customBlocks.dotBlock}</p>
  </div>

  <div className={styles.customBlockContainer} onClick={() => triggerCustomBlock('Rectangle')}>
    <Image
      className={styles.customBlockImage}
      src={"/images/rectangleBlock.png"}
      width={100}
      height={100}
      alt="Rectangle Block"
    />
    <p className={styles.customBlockNumber}>{user && user.customBlocks.rectangleBlock}</p>
  </div>
</div>


        <div className={styles.board}>
          {renderBoard().map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={
                  cell[0]
                    ? `${styles.cell} ${styles.activeCell}`
                    : `${styles.cell}`
                }
                style={{ backgroundColor: cell[0] ? cell[1] : "" }}
              >
                <div className={styles.sparkle}></div>
              </div>
            ))
          )}
        </div>

        <div className={styles.nextPieceContainer}>
          <h4 className={styles.customBlockHeading}>Next Piece</h4>
          <div className={styles.nextPiece}>{renderNextPiece()}</div>
        </div>
      </div>

      {/* Control buttons for mobile/PC */}
      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={() => {
            moveLeft();
            buttonSound.currentTime = 0;
            buttonSound.play();
          }} // Single click
        >
          <i className="bx bx-left-arrow-alt"></i>
        </button>
        <button
          className={styles.controlButton}
          onClick={() => {
            rotatePiece();
            buttonSound.currentTime = 0;
            buttonSound.play();
          }}
        >
          <i className="bx bx-rotate-right"></i>
        </button>
        <button
          className={styles.controlButton}
          onClick={() => {
            moveDown();
            buttonSound.currentTime = 0;
            buttonSound.play();
          }}
        >
          <i className="bx bx-down-arrow-alt"></i>
        </button>
        <button
          className={styles.controlButton}
          onClick={() => {
            moveRight();
            buttonSound.currentTime = 0;
            buttonSound.play();
          }}
        >
          <i className="bx bx-right-arrow-alt"></i>
        </button>
      </div>
      {/* <button
        className={styles.controlButton}
        onClick={triggerCustomBlock} // Button for the custom block
      >
        Custom Block
      </button> */}
      {/* <div className={styles.nextPieceContainer}>
        <p>Next Piece:</p>
        <div className={styles.nextPiece}>{renderNextPiece()}</div>
      </div> */}

      {gameOver && (
        <div className={styles.gameOver}>
          Game Over
          <h3 className={styles.gameOverStatHeading}>Builder Bucks Earned: {totalBuilderBucks} </h3>
          <button className={styles.restartButton} onClick={restartGame}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Tetris;
