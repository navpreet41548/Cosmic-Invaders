import styles from "@/styles/Leaderboard.module.css"
import Image from "next/image";
import Link from 'next/link'
import React, { useEffect, useState } from "react";


const leaderboard = () => {

    const [user, setUser] = useState()


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
              const { referredUser = [] } = data.user;
              setUser(data.user);
    
              // Calculate Total Referrals and Earnings
              const referralCount = referredUser.length;
              setTotalRefers(referralCount);
              setTotalEarnings(referralCount * 0.2); // $0.2 per referral
            } catch (error) {
              console.error("Error during login request:", error);
            }
          } else {
            console.error("No userId found in the URL");
          }
        };
    
        handleLogin();
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

    <div className={styles.player}>
        <div className={styles.left}>
            <div className={styles.playerNumber}>1</div>
        </div>
        <div className={styles.center}>
            <h3 className={styles.playerName}>Player Username #1</h3>
            <div className={styles.kills}>1500,000 Kills</div>
        </div>
        <div className={styles.right}>
            <div className={styles.medalContainer}>
                <Image className={styles.medailImage} src="/images/medal.png" width="50" height="50" alt='Medal Image' />
            </div>
        </div>
    </div>
    <div className={styles.player}>
        <div className={styles.left}>
            <div className={styles.playerNumber}>1</div>
        </div>
        <div className={styles.center}>
            <h3 className={styles.playerName}>Player Username #2</h3>
            <div className={styles.kills}>1500,000 Kills</div>
        </div>
        <div className={styles.right}>
            <div className={styles.medalContainer}>
                <Image className={styles.medailImage} src="/images/medal.png" width="50" height="50" alt='Medal Image' />
            </div>
        </div>
    </div>
    <div className={styles.player}>
        <div className={styles.left}>
            <div className={styles.playerNumber}>1</div>
        </div>
        <div className={styles.center}>
            <h3 className={styles.playerName}>Player Username #3</h3>
            <div className={styles.kills}>1500,000 Kills</div>
        </div>
        <div className={styles.right}>
            <div className={styles.medalContainer}>
                <Image className={styles.medailImage} src="/images/medal.png" width="50" height="50" alt='Medal Image' />
            </div>
        </div>
    </div>

    </div>
    </div>
  )
}

export default leaderboard