import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Play2.module.css";

export default function Play() {
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [spawnRate, setSpawnRate] = useState(2000);
  const [enemySpeed, setEnemySpeed] = useState(1);
  const [laserDots, setLaserDots] = useState([]);
  const [fireEffect, setFireEffect] = useState([]);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [countdown, setCountdown] = useState(5);

  const gunSound = typeof window !== "undefined" ? new Audio("/sound/laserGun.mp3") : null;
  const enemyOutSound = typeof window !== "undefined" ? new Audio("/sound/die.mp3") : null;
  const playerDieSound = typeof window !== "undefined" ? new Audio("/sound/playerDie.mp3") : null;

  if (enemyOutSound) {
    enemyOutSound.volume = 0.1;
  }

  useEffect(() => {
    if (score >= level * 10) {
      setLevel((prev) => prev + 1);
      setSpawnRate((prev) => Math.max(500, prev - 200));
      setEnemySpeed((prev) => prev + 0.2);
    }
  }, [score]);

  // Spawn enemies when game starts
  useEffect(() => {
    if (!gameOver) {
      const enemySpawn = setInterval(() => spawnEnemy(), spawnRate);
      return () => clearInterval(enemySpawn);
    }
  }, [spawnRate, gameOver]);

  // Move enemies toward base
  useEffect(() => {
    if (!gameOver) {
      const moveEnemies = setInterval(() => moveEnemiesToBase(), 100);
      return () => clearInterval(moveEnemies);
    }
  }, [enemies, gameOver, enemySpeed]);

  // Play death sound and start countdown on game over
  useEffect(() => {
    if (gameOver) {
      playerDieSound?.play();
      setCountdown(5);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            restartGame();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [gameOver]);

  async function updateTokenAmount(amount) {
    // API request to update token amount
  }

  async function handleContinueGame() {
    let userId;
    let username;
    if (window.Telegram.WebApp.initDataUnsafe.user) {
      userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      username = window.Telegram.WebApp.initDataUnsafe.user.username;
    } else {
      userId = "testingid";
      username = "navwebdev";
    }
    try {
      const response = await fetch("/api/decreaseCosmicToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: 10 }),
      });

      const data = await response.json();
      if (!response.ok || data.cosmicToken < 10) {
        window.location.href = '/shop';
      } else {
        setGameOver(false);
        setEnemies([]); // Clear nearby enemies
      }
    } catch (error) {
      console.error("Failed to decrease cosmic token:", error);
      window.location.href = '/shop';
    }
  }

  function spawnEnemy() {
    const randomAngle = Math.floor(Math.random() * 12) * 30;
    const radius = 110;
    const x = 50 + radius * Math.cos((randomAngle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((randomAngle * Math.PI) / 180);
    const limitedX = Math.min(Math.max(x, -10), 110);
    const limitedY = Math.min(Math.max(y, -10), 110);
    const angle = Math.atan2(50 - limitedY, 50 - limitedX) * (180 / Math.PI) + 90;

    const id = Date.now();
    setEnemies((prev) => [...prev, { id, x: limitedX, y: limitedY, angle }]);
  }

  function moveEnemiesToBase() {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        const dx = 50 - enemy.x;
        const dy = 50 - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 5) {
          setGameOver(true);
          return enemy;
        }
        return {
          ...enemy,
          x: enemy.x + (dx / dist) * enemySpeed,
          y: enemy.y + (dy / dist) * enemySpeed,
        };
      })
    );
  }

  async function updateTokenAmount(amount) {
    try {
      let userId;
      let username;
  
      if (window.Telegram.WebApp.initDataUnsafe.user) {
        userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        username = window.Telegram.WebApp.initDataUnsafe.user.username;
      } else {
        userId = "testingid"; // Fallback for testing purposes
        username = "navwebdev"; // Fallback for testing purposes
      }
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tokenAmount: amount }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update token amount");
      }
  
      const data = await response.json();
      console.log(data.message); // Log success message
    } catch (error) {
      console.error("Error updating token amount:", error);
    }
  }
  

  function handleShootEnemy(id, targetX, targetY) {
    // Play gun sound immediately
    gunSound.play();

    const startX = 50; // Base position in %
    const startY = 50;
    const dx = targetX - startX;
    const dy = targetY - startY;

    // Define bullet dots with staggered delays
    const bulletDots = [
      { id, x: startX, y: startY, dx, dy, delay: 0 },
      { id, x: startX, y: startY, dx, dy, delay: 0.05 },
      { id, x: startX, y: startY, dx, dy, delay: 0.1 }
    ];

    setLaserDots((prev) => [...prev, ...bulletDots]);

    // Show fire effect for the current enemy and play enemy hit sound after bullet "hit"
    setTimeout(() => {
      setFireEffect((prev) => [...prev, id]);
      enemyOutSound.play();
    }, 300); // Wait until bullets "hit"

    setTimeout(async () => {
      setEnemies((prev) => prev.filter((enemy) => enemy.id !== id));
      setScore((prev) => prev + 1); // Update score when enemy is "hit"

      // Increment tokenAmount and send reward to backend
      setTokenAmount((prev) => {
        const newTokenAmount = prev + 5;
        updateTokenAmount(newTokenAmount); // Send the new token amount to the backend
        return newTokenAmount;
      });

      // Clear laser dots and fire effect for the current enemy only
      setLaserDots((prev) => prev.filter((dot) => dot.id !== id));
      setFireEffect((prev) => prev.filter((enemyId) => enemyId !== id));
    }, 600); // Matches explosion duration
}

  function restartGame() {
    setEnemies([]);
    setScore(0);
    setLevel(1);
    setSpawnRate(2000);
    setEnemySpeed(1);
    setGameOver(false);
    setLaserDots([]);
    setFireEffect([]);
    setTokenAmount(0);
  }

  return (
    <div className={styles.container}>
      <Image src={"/images/playBg.png"} className={styles.bgImage} width={500} height={1000} alt={"Background Image"} />
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/">BACK</Link>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.stat}>ENEMY KILLED: {score}</p>
          <p className={styles.stat}>LEVEL: {level}</p>
        </div>
      </div>
      <div className={styles.playArea}>
        <Image className={styles.baseImage} src="/images/play/base.png" width="200" height="250" alt="Base Image" />
        {enemies.map((enemy) => (
          <div key={enemy.id} className={styles.enemyContainer}>
            <Image src={"/images/play/simpleEnemy.png"} className={styles.enemyImage} style={{
              left: `${enemy.x}%`, top: `${enemy.y}%`, transform: `rotate(${enemy.angle}deg)`
            }} width={50} height={50} alt="Enemy" onClick={() => handleShootEnemy(enemy.id, enemy.x, enemy.y)} />
            {fireEffect.includes(enemy.id) && (
              <Image src="/images/play/fire.png" className={styles.fireImage} width={50} height={50} alt="Explosion"
                     style={{ left: `${enemy.x}%`, top: `${enemy.y}%`, position: 'absolute' }} />
            )}
          </div>
        ))}
        {laserDots.map((dot, index) => (
          <div key={index} className={styles.laserDot} style={{
            left: `${dot.x}%`, top: `${dot.y}%`, animationDelay: `${dot.delay}s`, "--dx": dot.dx, "--dy": dot.dy,
          }} />
        ))}
        {gameOver && (
          <div className={styles.gameOverOverlay}>
            <div className={styles.gameOverContainer}>
              <div className={styles.gameOverHeader}>
                <h3 className={styles.gameOverHeaderText}>YOU DIED</h3>
                <div className={styles.cross} onClick={restartGame}><i className='bx bx-x'></i></div>
              </div>
              <h2 className={styles.gameOverMainHeading}>CONTINUE?</h2>
              <div className={styles.gameOverTimeContainer}>{countdown}</div>
              <div className={styles.gameOverButtonContainer}>
                <button className={`${styles.gameOverButton} ${styles.gameOverButton1}`} onClick={handleContinueGame}>
                  <Image className={styles.gameOverButtonIcon} src="/images/cosmicToken.png" width="50" height={'50'}
                         alt="Cosmic Token" />
                  10
                </button>
                <button className={`${styles.gameOverButton} ${styles.gameOverButton2}`} onClick={() => window.location.href = '/'}>
                  <Image className={styles.gameOverButtonIcon} src="/images/play/ad.png" width="50" height={'50'} alt="Ad Icon" />
                  FREE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
