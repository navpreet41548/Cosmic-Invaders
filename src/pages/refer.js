import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/refer.module.css";
import Image from "next/image";
import Link from "next/link";

const refer = () => {
  const [copyText, setCopyText] = useState("COPY");
  const [user, setUser] = useState(null);
  const [totalRefers, setTotalRefers] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const handleCopy = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyText("COPIED");
        setTimeout(() => {
          setCopyText("COPY");
        }, 3000); // Change back to "COPY" after 3 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

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
    <>
      <div className={styles.containerWrapper}>
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

          <h2 className={styles.mainHeading}>REFER AND EARN</h2>
          <p className={styles.mainPara}>
            Referrers receive <span className={styles.diff}>$0.02 - $1</span> per successful referral. Referees start with <span className={styles.diff}>2000</span> $Cosmic.
          </p>

          <div className={styles.codeContainer}>
            <div className={styles.codeHeader}>
              <h3 className={styles.codeHeading}>Share this URL</h3>
            </div>
            <h4 className={styles.codeSubHeading}>
              {user &&
                `https://t.me/CosmicInvadersBot/cosmicinvaders?startapp=${user.referCode}`}
            </h4>
            <button
              className={styles.button}
              onClick={() =>
                handleCopy(
                  user &&
                    `https://t.me/CosmicInvadersBot/cosmicinvaders?startapp=${user.referCode}`
                )
              }
            >
              {copyText}
            </button>
          </div>

          <div className={styles.statWrapper}>
            <div className={styles.statContainer}>
              <h5 className={styles.statHeading}>Total Earnings</h5>
              <div className={styles.statInput}>
                ${totalEarnings.toFixed(2)}
              </div>
            </div>
            <div className={styles.statContainer}>
              <h5 className={styles.statHeading}>Total Referrals</h5>
              <div className={styles.statInput}>
                {totalRefers}
              </div>
            </div>
          </div>

          <h5 className={styles.noteHeading}>Token transfer will be available after the Airdrop</h5>
        </div>
      </div>
    </>
  );
};

export default refer;
