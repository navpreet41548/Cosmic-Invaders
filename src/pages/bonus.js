import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/bonus.module.css";
import Image from "next/image";
import Link from "next/link";
// import WonPopup from "../../components/WonPopup";

const bonus = () => {
  const [user, setUser] = useState();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [rewardValue, setRewardValue] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Update the current date every minute to ensure accurate availability checks
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  const handleCollect = async (dailyBonusId) => {
    console.log(dailyBonusId);
    try {
      const response = await fetch("/api/collectDailyBonus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId, // Replace with actual user ID
          dailyBonusId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Bonus collected:", data);
        setRewardValue(data.reward); // Assuming `data.reward` contains the reward value
        setShowPopup(true);
        setUser(data.user);
        // Update the UI or state based on the successful collection
      } else {
        console.error("Error collecting bonus:", data.error);
        // Handle the error (e.g., show a message to the user)
      }
    } catch (error) {
      console.error("Error making request:", error);
      // Handle the error (e.g., show a message to the user)
    }
  };

  useEffect(() => {
    const handleLogin = async () => {
      // Get the current URL
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      // Extract the userId from the query parameters
      // const userId = params.get("userid");
      let userId;
      let username;

      if (window.Telegram.WebApp.initDataUnsafe.user) {
        userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        username = window.Telegram.WebApp.initDataUnsafe.user.username;
      } else {
        userId = "testingid";
        username = "navwebdev";
      }

      if (userId) {
        try {
          // Define the login endpoint
          const endpoint = "/api/login"; // Adjust this to your actual endpoint

          // Make the request to the login endpoint
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, username }), // Send the userId as part of the request body
          });

          const data = await response.json();
          console.log("Login response:", data);
          setUser(data.user);
        } catch (error) {
          console.error("Error during login request:", error);
        }
      } else {
        console.error("No userId found in the URL");
      }
    };

    // Call the function to handle login
    handleLogin();
  }, []); //

  useEffect(() => {
    if (rewardValue) {
      setShowPopup(true);
    }
  }, [rewardValue]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setRewardValue(null); // Reset reward value if needed
  };

  return (
    <>
     
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          <div className={styles.mainHeader}>
            <div className={styles.mainHeaderLeft}>
              <Link className={styles.backButton} href={"/"}>
                <i className="bx bx-arrow-back"></i>Back
              </Link>
            </div>
            <div className={styles.mainHeaderRight}>
              <div className={styles.coinContainer}>
                <Image
                  className={styles.coinImage}
                  src={"/images/cosmicToken.png"}
                  width={60}
                  height={60}
                  alt="Cosmic Token"
                />
                <h3 className={styles.coinNumber}>{user && user.cosmicToken}</h3>
              </div>
              <div className={styles.coinContainer}>
                <Image
                  className={styles.coinImage}
                  src={"/images/proCoin.png"}
                  width={60}
                  height={60}
                  alt="Pro Coin"
                />
                <h3 className={styles.coinNumber}>{user && user.proCoin}</h3>
              </div>
            </div>
          </div>
          <h2 className={styles.mainHeading}>DAILY BONUS</h2>
          <div className={styles.header}>
            <div className={styles.col1}>DAY</div>
            <div className={styles.col2}> PRIZE</div>
            <div className={styles.col3}></div>
          </div>

          {user &&
            user.dailyBonus.map((daily) => {
              const isAvailable = new Date(daily.availableOn) <= currentDate;
              return (
                <div className={styles.row} key={daily.day}>
                  <div className={styles.col1}>{daily.day}</div>
                  <div className={styles.col2}>
                    <Image
                      className={styles.prizeLogo}
                      src={
                        daily.reward.includes("Cosmic")
                          ? "/images/cosmicToken.png"
                          : daily.reward.includes("$Pro")
                          ? "/images/proCoin.png"
                          : "/images/cosmicToken.png" // Default image
                      }
                      width={50}
                      height={50}
                      alt="Coin Logo"
                    />
{daily.reward.includes("Cosmic Token") 
  ? `${daily.reward.split(" ")[0]} $Cosmic` // Extracts Num and appends $Block
  : daily.reward // Displays Pro Coin rewards normally
}
                    
                  </div>
                  <div className={styles.col3}>
                    {daily.collected ? (
                      <button
                        className={`${styles.button} ${styles.buttonCollected}`}
                        disabled
                      >
                        Collected
                      </button>
                    ) : isAvailable ? (
                      <button
                        onClick={() => handleCollect(daily._id)}
                        className={styles.button}
                      >
                        Collect
                      </button>
                    ) : (
                      <button
                        className={`${styles.button} ${styles.buttonNotAvailable}`}
                        disabled
                      >
                        Day {daily.day}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          {/* 
          <div className={styles.row}>
            <div className={styles.col1}>Day 1</div>
            <div className={styles.col2}>
              <Image
                className={styles.prizeLogo}
                src={"/images/coin.png"}
                width={50}
                height={50}
                alt="Coin Logo"
              />
              1 Spin Token
            </div>
            <div className={styles.col3}>
              <button className={styles.button}>Collect</button>
            </div>
          </div> */}

          {/* {showPopup && (
            <WonPopup rewardValue={rewardValue} onClose={handleClosePopup} />
          )} */}
        </div>
      </div>
    </>
  );
};

export default bonus;
