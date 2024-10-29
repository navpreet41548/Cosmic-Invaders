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

  // Update difficulty and level based on score
  useEffect(() => {
    if (score >= level * 10) {
      setLevel((prev) => prev + 1);
      setSpawnRate((prev) => Math.max(500, prev - 200));
      setEnemySpeed((prev) => prev + 0.2);
    }
  }, [score]);

  // Spawn enemies based on spawnRate
  useEffect(() => {
    if (!gameOver) {
      const enemySpawn = setInterval(() => spawnEnemy(), spawnRate);
      return () => clearInterval(enemySpawn);
    }
  }, [spawnRate, gameOver]);

  // Move enemies toward the base
  useEffect(() => {
    if (!gameOver) {
      const moveEnemies = setInterval(() => moveEnemiesToBase(), 100);
      return () => clearInterval(moveEnemies);
    }
  }, [enemies, gameOver, enemySpeed]);

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

  function handleShootEnemy(id) {
    setEnemies((prev) => prev.filter((enemy) => enemy.id !== id));
    setScore((prev) => prev + 1);
  }

  function restartGame() {
    setEnemies([]);
    setScore(0);
    setLevel(1);
    setSpawnRate(2000);
    setEnemySpeed(1);
    setGameOver(false);
  }

  return (
    <>
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
            <Image
              key={enemy.id}
              src={"/images/play/simpleEnemy2.png"}
              className={styles.enemyImage}
              style={{
                left: `${enemy.x}%`,
                top: `${enemy.y}%`,
                transform: `rotate(${enemy.angle}deg)`,
              }}
              width={50}
              height={50}
              alt="Enemy"
              onClick={() => handleShootEnemy(enemy.id)}
            />
          ))}
          {gameOver && (
            <div className={styles.gameOverOverlay}>

            <div className={styles.gameOverContainer}>
              <div className={styles.gameOverText}>Game Over</div>
              <button className={styles.restartButton} onClick={restartGame}>Restart</button>
            </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
