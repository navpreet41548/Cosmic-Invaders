import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Play.module.css";

export default function Play() {
  const [playerX, setPlayerX] = useState(45); // Player horizontal position
  const [bullets, setBullets] = useState([]); // Player bullets array
  const [enemies, setEnemies] = useState([]); // Enemies array
  const [enemyBullets, setEnemyBullets] = useState([]); // Enemy bullets array
  const [kills, setKills] = useState(0); // Track enemy kills
  const [level, setLevel] = useState(1); // Game level
  const [playerDirection, setPlayerDirection] = useState(0); // Player movement direction
  const [playerMoving, setPlayerMoving] = useState(false); // Track whether player is moving
  const [enemySpeed, setEnemySpeed] = useState(50); // Enemy speed

  const levelEnemyCounts = [5, 7, 9]; // Number of enemies per level, increases over time

  // Spawn enemies when a new level starts
  useEffect(() => {
    const spawnEnemies = () => {
      const numberOfEnemies = levelEnemyCounts[level - 1] || 9; // Default to 9 enemies after level 3
      const newEnemies = [];
      for (let i = 0; i < numberOfEnemies; i++) {
        newEnemies.push({
          id: Math.random().toString(36).substr(2, 9), // Generate a unique ID for each enemy
          x: Math.random() * 90, // Random horizontal position
          y: Math.random() * 90, // Random vertical position
          xDirection: Math.random() < 0.5 ? 1 : -1, // Random horizontal direction
          yDirection: Math.random() < 0.5 ? 1 : -1, // Random vertical direction
        });
      }
      setEnemies(newEnemies);
    };

    spawnEnemies(); // Spawn enemies when the level changes
  }, [level]);

// Automatically shoot bullets every 200ms (increased frequency)
useEffect(() => {
  const shoot = setInterval(() => {
    setBullets((prevBullets) => [
      ...prevBullets,
      { x: playerX + 2, y: 90 }, // Position the bullet based on player's x-coordinate
    ]);
  }, 300); // Changed from 500ms to 200ms for more frequent shooting

  return () => clearInterval(shoot); // Clean up the interval
}, [playerX]);



  // Move bullets upward and remove off-screen bullets
  useEffect(() => {
    const moveBullets = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets
          .map((bullet) => ({ ...bullet, y: bullet.y - 5 })) // Move bullets up
          .filter((bullet) => bullet.y > 0) // Remove bullets that go off-screen
      );
    }, 50);

    return () => clearInterval(moveBullets); // Clean up the interval
  }, []);

  // Move enemies horizontally and vertically with boundary checks
  useEffect(() => {
    const moveEnemies = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          // Reverse horizontal direction if enemy reaches 0% or 90% horizontally
          if (enemy.x <= 0) {
            enemy.x = 0; // Set to minimum boundary
            enemy.xDirection = 1; // Change direction to the right
          } else if (enemy.x >= 90) {
            enemy.x = 90; // Set to maximum boundary
            enemy.xDirection = -1; // Change direction to the left
          }
  
          // Reverse vertical direction if enemy reaches 0% or 90% vertically
          if (enemy.y <= 0) {
            enemy.y = 0; // Set to minimum boundary
            enemy.yDirection = 1; // Change direction downwards
          } else if (enemy.y >= 90) {
            enemy.y = 90; // Set to maximum boundary
            enemy.yDirection = -1; // Change direction upwards
          }
  
          return {
            ...enemy,
            x: enemy.x + enemy.xDirection * 0.5, // Move horizontally
            y: enemy.y + enemy.yDirection * 0.3, // Move vertically
          };
        })
      );
    }, enemySpeed);
  
    return () => clearInterval(moveEnemies); // Clean up the interval
  }, [enemySpeed]); // Removed enemies from the dependency array to avoid infinite loop
  
  // Each enemy fires bullets independently
  useEffect(() => {
    const enemyShootIntervals = enemies.map((enemy) => {
      const intervalId = setInterval(() => {
        setEnemyBullets((prevEnemyBullets) => [
          ...prevEnemyBullets,
          { x: enemy.x + 2, y: enemy.y + 5 }, // Shoot downward from each enemy
        ]);
      }, Math.random() * 1000 + 500); // Random interval between 500ms to 1500ms

      return intervalId;
    });

    // Clear intervals when enemies change
    return () => enemyShootIntervals.forEach((intervalId) => clearInterval(intervalId));
  }, [enemies]);

  // Move enemy bullets downward
  useEffect(() => {
    const moveEnemyBullets = setInterval(() => {
      setEnemyBullets((prevEnemyBullets) =>
        prevEnemyBullets
          .map((bullet) => ({ ...bullet, y: bullet.y + 2 })) // Move bullets down
          .filter((bullet) => bullet.y < 100) // Remove bullets that go off-screen
      );
    }, 50);

    return () => clearInterval(moveEnemyBullets); // Clean up the interval
  }, [enemyBullets]);

  // Collision detection between player bullets and enemies
  useEffect(() => {
    const detectCollision = () => {
      let bulletsToRemove = [];

      bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy) => {
          if (
            bullet.x >= enemy.x - 2 &&
            bullet.x <= enemy.x + 2 &&
            bullet.y <= enemy.y + 5
          ) {
            bulletsToRemove.push(bulletIndex); // Mark this bullet for removal
            setEnemies((prevEnemies) =>
              prevEnemies.filter((e) => e.id !== enemy.id) // Remove only the hit enemy
            );
            setKills((prevKills) => prevKills + 1); // Increase the kill count
          }
        });
      });

      // Remove the bullets that hit enemies
      setBullets((prevBullets) =>
        prevBullets.filter((_, index) => !bulletsToRemove.includes(index))
      );
    };

    detectCollision();
  }, [bullets, enemies]);

  // Collision detection between enemy bullets and player
  useEffect(() => {
    const checkPlayerHit = () => {
      const hit = enemyBullets.some(
        (bullet) => bullet.x >= playerX - 2 && bullet.x <= playerX + 2 && bullet.y >= 90
      );

      if (hit) {
        alert("Player hit! Game Over.");
        setPlayerMoving(false); // Stop player movement
      }
    };

    checkPlayerHit();
  }, [enemyBullets, playerX]);

  // Level progression logic
  useEffect(() => {
    if (enemies.length === 0 && kills > 0) {
      const newLevel = level + 1;
      setLevel(newLevel); // Move to the next level
      setKills(0); // Reset kills for the new level
      if (newLevel > 3) {
        setEnemySpeed((prevSpeed) => Math.max(20, prevSpeed - 5)); // Increase speed after level 3
      }
    }
  }, [enemies.length, kills]); // Trigger level progression only when enemies.length changes

  // Smooth player movement
  useEffect(() => {
    let moveInterval;
    if (playerMoving) {
      moveInterval = setInterval(() => {
        setPlayerX((prevX) => Math.min(90, Math.max(0, prevX + playerDirection * 1))); // Move the player smoothly
      }, 16); // Approximately 60 frames per second
    }

    return () => clearInterval(moveInterval); // Clean up the interval
  }, [playerMoving, playerDirection]); // Depend on playerMoving and playerDirection

  // Start moving the player
  const startMoving = (direction) => {
    setPlayerDirection(direction); // Set the movement direction
    setPlayerMoving(true); // Start movement
  };

  // Stop moving the player
  const stopMoving = () => {
    setPlayerMoving(false); // Stop movement
  };

  return (
    <>
      <div className={styles.container}>
        <Image src={"/images/playBg.png"} className={styles.bgImage} width={500} height={1000} alt={"Background Image"} />

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/">BACK</Link>
          </div>
          <div className={styles.headerRight}>
            <p className={styles.stat}>ENEMY KILLED: {kills}</p>
            <p className={styles.stat}>LEVEL: {level}</p>
          </div>
        </div>

        <div className={styles.playArea}>
          <div className={styles.enemyArea}>
            {/* Render Enemies */}
            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                className={styles.enemy}
                style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
              >
                <Image src={"/images/play/simpleEnemy.png"} className={styles.enemyImage} width={50} height={50} alt={"Enemy"} />
              </div>
            ))}
          </div>

          <div className={styles.playerArea}>
            <div className={styles.player} style={{ left: `${playerX}%` }}>
              <Image src={"/images/play/player.png"} className={styles.playerImage} width={50} height={100} alt={"Player"} />
            </div>
          </div>

          {/* Render Player Bullets */}
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className={styles.bullet}
              style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
            ></div>
          ))}

          {/* Render Enemy Bullets */}
          {enemyBullets.map((bullet, index) => (
            <div
              key={index}
              className={styles.enemyBullet}
              style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
            ></div>
          ))}

          <div className={styles.buttonArea}>
            <button
              className={styles.button}
              onMouseDown={() => startMoving(-1)}
              onMouseUp={stopMoving}
              onTouchStart={() => startMoving(-1)}
              onTouchEnd={stopMoving}
            >
              <i className="bx bx-left-arrow-alt"></i>
            </button>
            <button
              className={styles.button}
              onMouseDown={() => startMoving(1)}
              onMouseUp={stopMoving}
              onTouchStart={() => startMoving(1)}
              onTouchEnd={stopMoving}
            >
              <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
