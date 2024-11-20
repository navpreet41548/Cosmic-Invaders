import styles from "@/styles/Leaderboard.module.css";
import Image from "next/image";
import Link from 'next/link';
import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [user, setUser] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]); // State to store top players

  useEffect(() => {
    // Fetch the user data (similar to your existing logic)
    const fetchUser = async () => {
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
        const response = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch the top 10 players
    const fetchTopPlayers = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        setTopPlayers(data.players); // Update topPlayers state
      } catch (error) {
        console.error("Error fetching top players:", error);
      }
    };

    fetchUser();
    fetchTopPlayers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link className={styles.backButton} href={"/"}>
          <i className="bx bx-arrow-back"></i>
          Back
        </Link>

        <div className={styles.coinWrapper}>
          <div className={styles.coinContainer}>
            <Image
              src={"/images/cosmicToken.png"}
              className={styles.coinImage}
              width={40}
              height={40}
              alt="Cosmic Token"
            />
            <h4 className={styles.coinNumber}>{user && user.cosmicToken}</h4>
          </div>
        </div>
      </div>

      <h5 className={styles.mainHeading}>LEADERBOARD</h5>

      <div>
      {topPlayers.length > 0 ? (
  topPlayers.map((player, index) => (
    <div className={styles.player} key={player.userId}>
      <div className={styles.left}>
        <div className={styles.playerNumber}>{index + 1}</div>
      </div>
      <div className={styles.center}>
        <h3 className={styles.playerName}>{player.username || `Player ${index + 1}`}</h3>
        <div className={styles.kills}>{player.totalKills.toLocaleString()} Kills</div>
      </div>
      <div className={styles.right}>
        <div className={styles.medalContainer}>
          <Image
            className={styles.medailImage}
            src={
              index === 0
                ? "/images/gold.png" // Gold medal for 1st place
                : index === 1
                ? "/images/silver.png" // Silver medal for 2nd place
                : index === 2
                ? "/images/bronze.png" // Bronze medal for 3rd place
                : "/images/medal.png" // Default medal for others
            }
            width="50"
            height="50"
            alt={
              index === 0
                ? "Gold Medal"
                : index === 1
                ? "Silver Medal"
                : index === 2
                ? "Bronze Medal"
                : "Participation Medal"
            }
          />
        </div>
      </div>
    </div>
  ))
) : (
  <p>Loading leaderboard...</p>
)}

      </div>
    </div>
  );
};

export default Leaderboard;
