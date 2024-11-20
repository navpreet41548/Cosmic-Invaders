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
  const [user, setUser] = useState()
  const [baseImage, setBaseImage] = useState("/images/base1.png")

  const [totalEnemiesKilled, setTotalEnemiesKilled] = useState(0); // Track total enemies killed


  // New states for power-ups
  const [forceFieldActive, setForceFieldActive] = useState(false);
  const [forceFieldCooldown, setForceFieldCooldown] = useState(false);
  const [energyPulseActive, setEnergyPulseActive] = useState(false);
  const [energyPulseCooldown, setEnergyPulseCooldown] = useState(false);


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
    setEnemies((prev) => [
      ...prev,
      { id, x: limitedX, y: limitedY, angle, speed: enemySpeed }, // Include speed
    ]);
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
          x: enemy.x + (dx / dist) * enemy.speed, // Use enemy's own speed
          y: enemy.y + (dy / dist) * enemy.speed, // Use enemy's own speed
        };
      })
    );
  }
  

  async function updateTokenAmount(amount, enemiesKilled) {
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
        body: JSON.stringify({ userId, tokenAmount: amount, totalEnemiesKilled: enemiesKilled }),
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
  
  function handleShootEnemy(id, targetXPercent, targetYPercent) {
    gunSound.play();
  
    const baseCenterX = 50; // Base center percentage
    const baseCenterY = 50; // Base center percentage
  
    const enemySizePercent = 50 / 500 * 100; // Convert enemy size (50px out of 500px container width) to percentage
    const adjustedTargetXPercent = targetXPercent + enemySizePercent / 2; // Add half the enemy size to get the center
    const adjustedTargetYPercent = targetYPercent + enemySizePercent / 2; // Add half the enemy size to get the center
  
    const dx = adjustedTargetXPercent - baseCenterX;
    const dy = adjustedTargetYPercent - baseCenterY;
  
    const bulletDots = [
      { id, x: baseCenterX, y: baseCenterY, dx, dy, delay: 0 },
      { id, x: baseCenterX, y: baseCenterY, dx, dy, delay: 0.05 },
      { id, x: baseCenterX, y: baseCenterY, dx, dy, delay: 0.1 },
    ];
  
    setLaserDots((prev) => [...prev, ...bulletDots]);
  
    setTimeout(() => {
      setFireEffect((prev) => [...prev, id]);
      enemyOutSound.play();
    }, 300);
  
    setTimeout(() => {
      setEnemies((prev) => prev.filter((enemy) => enemy.id !== id));
      setScore((prev) => prev + 1);
  
      // Increment tokenAmount and totalEnemiesKilled
      setTokenAmount((prev) => prev + 5);
      setTotalEnemiesKilled((prev) => prev + 1); // Update total enemies killed
  
      setLaserDots((prev) => prev.filter((dot) => dot.id !== id));
      setFireEffect((prev) => prev.filter((enemyId) => enemyId !== id));
    }, 600);
  }
  
  
  
  useEffect(() => {
    if (gameOver) {
      updateTokenAmount(tokenAmount, totalEnemiesKilled);
    }
  }, [gameOver]);
  
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
    setTotalEnemiesKilled(0); // Reset total enemies killed
  }


  useEffect(() => {
    const handleLogin = async () => {
      const url = new URL(window.location.href);
      let userId, username;

      if (window.Telegram.WebApp.initDataUnsafe.user) {
        userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        username = window.Telegram.WebApp.initDataUnsafe.user.username;
      } else {
        userId = "testingid";
        username = "navwebdev";
      }

      if (userId) {
        try {
          const endpoint = "/api/getUser";

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          const data = await response.json();
          console.log("Login response:", data);

          // Set user data and calculate totals
          setUser(data.user);

          // Calculate Total Referrals and Earnings
          const baseMapping = {
            "Base 1": "/images/base1.png",
            "Base 2": "/images/base2.png",
            "Base 3": "/images/base3.png",
            "Base 4": "/images/base4.png",
          };
          console.log(data.user.currentBase)
          setBaseImage(baseMapping[data.user.currentBase] || "/images/base1.png");
        } catch (error) {
          console.error("Error during login request:", error);
        }
      } else {
        console.error("No userId found in the URL");
      }
    };

    handleLogin();
  }, []);


  function spawnReplacementEnemy(speed) {
    const randomAngle = Math.floor(Math.random() * 12) * 30;
    const radius = 110;
    const x = 50 + radius * Math.cos((randomAngle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((randomAngle * Math.PI) / 180);
    const limitedX = Math.min(Math.max(x, -10), 110);
    const limitedY = Math.min(Math.max(y, -10), 110);
    const angle = Math.atan2(50 - limitedY, 50 - limitedX) * (180 / Math.PI) + 90;
  
    return { id: Date.now(), x: limitedX, y: limitedY, angle, speed }; // Reuse speed
  }
  



// Forece Field Active
useEffect(() => {
  if (forceFieldActive) {
    const destroyEnemiesInterval = setInterval(() => {
      setEnemies((prevEnemies) => {
        const updatedEnemies = [];
        prevEnemies.forEach((enemy) => {
          // Shield boundaries
          const shieldLeft = 50 - (130 / 2 / 500) * 100; // 130px half-width converted to percentage
          const shieldRight = 50 + (130 / 2 / 500) * 100;
          const shieldTop = 50 - (130 / 2 / 500) * 100;
          const shieldBottom = 50 + (130 / 2 / 500) * 100;

          if (
            enemy.x >= shieldLeft &&
            enemy.x <= shieldRight &&
            enemy.y >= shieldTop &&
            enemy.y <= shieldBottom &&
            !enemy.isDestroyed // Check if not already marked for removal
          ) {
            // Mark the enemy as destroyed
            enemyOutSound?.play();
            setScore((prev) => prev + 1);
            setTotalEnemiesKilled((prev) => prev + 1);
            setFireEffect((prev) => [...prev, enemy.id]); // Trigger fire animation

            // Schedule enemy removal
            setTimeout(() => {
              setFireEffect((prev) => prev.filter((id) => id !== enemy.id)); // Remove fire effect
              setEnemies((currentEnemies) =>
                currentEnemies.filter((e) => e.id !== enemy.id)
              ); // Remove enemy from list
            }, 1000); // Fire animation duration (1 second)
          } else {
            updatedEnemies.push(enemy); // Keep unaffected enemies
          }
        });
        return updatedEnemies;
      });
    }, 200); // Check every 200ms

    const deactivateForceField = setTimeout(() => {
      setForceFieldActive(false);
    }, 10000); // Lasts for 10 seconds

    return () => {
      clearInterval(destroyEnemiesInterval);
      clearTimeout(deactivateForceField);
    };
  }
}, [forceFieldActive]);


// Energy Pulse effect
useEffect(() => {
  if (energyPulseActive) {
    const destroyEnemiesPulse = setInterval(() => {
      setEnemies((prevEnemies) => {
        return prevEnemies.flatMap((enemy) => {
          const dx = 50 - enemy.x; // Distance from center
          const dy = 50 - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 30) {
            // Destroy enemy and replace with a new one
            enemyOutSound?.play();
            setScore((prev) => prev + 1);
            setTotalEnemiesKilled((prev) => prev + 1);
            return [spawnReplacementEnemy(enemy.speed)];
          }

          return [enemy]; // Keep the original enemy
        });
      });
    }, 1000); // Pulses every second

    const deactivatePulse = setTimeout(() => {
      setEnergyPulseActive(false);
    }, 5000); // Lasts for 5 seconds

    return () => {
      clearInterval(destroyEnemiesPulse);
      clearTimeout(deactivatePulse);
    };
  }
}, [energyPulseActive]);

    // Activate Forcefield
    const activateForceField = () => {
      if (!forceFieldCooldown) {
        setForceFieldActive(true);
        setForceFieldCooldown(true);
        setTimeout(() => setForceFieldCooldown(false), 30000); // Cooldown of 30 seconds
      }
    };
  
    // Activate Energy Pulse
    const activateEnergyPulse = () => {
      if (!energyPulseCooldown) {
        setEnergyPulseActive(true);
        setEnergyPulseCooldown(true);
        setTimeout(() => setEnergyPulseCooldown(false), 1000); // Cooldown of 30 seconds
      }
    };



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
        <Image className={styles.baseImage}  src={baseImage} width="200" height="250" alt="Base Image" />

        {forceFieldActive && (
          <Image
            src="/images/sheild.png"
            className={styles.forceField}
            width={300}
            height={300}
            alt="Force Field"
            style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          />
        )}
{enemies.map((enemy) => (
  <div key={enemy.id} className={styles.enemyContainer}>
    <Image
      src={"/images/play/simpleEnemy.png"}
      className={styles.enemyImage}
      style={{
        left: `${enemy.x}%`,
        top: `${enemy.y}%`,
        transform: `rotate(${enemy.angle}deg)`,
      }}
      width={50}
      height={50}
      alt="Enemy"
      onClick={() => handleShootEnemy(enemy.id, enemy.x, enemy.y)}
    />
    {fireEffect.includes(enemy.id) && (
      <Image
        src="/images/play/fire.png"
        className={styles.fireImage}
        width={50}
        height={50}
        alt="Explosion"
        style={{
          left: `${enemy.x}%`,
          top: `${enemy.y}%`,
          position: "absolute",
        }}
      />
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

<div className={styles.powerUpContainerWrapper}>
          <div className={styles.powerUpContainer}>
            <div className={styles.powerUpImageContainer}>
            <div className={styles.powerUpCooldown}>
              30 
            </div>
            <Image className={styles.powerUpImage} src="/images/forceField.png" width="100" height="100" alt="Force Field"/>
            </div>
            <h4 className={styles.powerUpNumber}>{user && user.powerUps.forceField}</h4>
          </div>
          <div className={styles.powerUpContainer}>
          <div className={styles.powerUpImageContainer}>

            <div className={styles.powerUpCooldown}>
              30 
            </div>
            <Image className={styles.powerUpImage} src="/images/energyPulse.png" width="100" height="100" alt="Enery Pulse"/>
          </div>
            <h4 className={styles.powerUpNumber}>{user && user.powerUps.energyPulse}</h4>
          </div>
        </div> <div className={styles.powerUpContainerWrapper}>
          <div onClick={activateForceField} className={styles.powerUpContainer}>
            <div className={styles.powerUpImageContainer}>
            <div className={styles.powerUpCooldown}>
              30 
            </div>
            <Image className={styles.powerUpImage} src="/images/forceField.png" width="100" height="100" alt="Force Field"/>
            </div>
            <h4 className={styles.powerUpNumber}>{user && user.powerUps.forceField}</h4>
          </div>
          <div onClick={activateEnergyPulse} className={styles.powerUpContainer}>
          <div className={styles.powerUpImageContainer}>

            <div className={styles.powerUpCooldown}>
              30 
            </div>
            <Image className={styles.powerUpImage} src="/images/energyPulse.png" width="100" height="100" alt="Enery Pulse"/>
          </div>
            <h4 className={styles.powerUpNumber}>{user && user.powerUps.energyPulse}</h4>
          </div>
        </div>


      </div>
    </div>
  );
}