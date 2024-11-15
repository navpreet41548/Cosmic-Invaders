import styles from "@/styles/Bases.module.css"
import Image from "next/image";
import Link from 'next/link'
import React, { useEffect, useState } from "react";


const bases = () => {

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

    <h5 className={styles.mainHeading}>BASES</h5>
    <div>
        <div className={styles.baseContainer}>
            <div className={styles.left}>
            <Image
            src={"/images/base1.png"}
            className={styles.baseImage}
            width={200}
            height={200}
            alt="Base Image"
          />

            </div>
            <div className={styles.right}>
                <h3 className={styles.baseName}>BASE NAME HERE</h3>
                <div className={styles.levelContainer}>
                    <h4 className={styles.level}>LEVEL 1</h4>
                    <h4 className={styles.requirement}>OPENS AT LEVEL 1</h4>
                </div>
                <div className={styles.buttonContainer}>

                <button className={styles.button}>EQUIPPED</button>
                </div>
            </div>
        </div>
        <div className={styles.baseContainer}>
            <div className={styles.left}>
            <Image
            src={"/images/base2.png"}
            className={styles.baseImage}
            width={200}
            height={200}
            alt="Base Image"
          />

            </div>
            <div className={styles.right}>
                <h3 className={styles.baseName}>BASE NAME HERE</h3>
                <div className={styles.levelContainer}>
                    <h4 className={styles.level}>LEVEL 2</h4>
                    <h4 className={styles.requirement}>REQUIRE 10,000 TOTAL KILLS</h4>
                </div>

                <div className={styles.meterContainer}>
                    <h3 className={styles.meterNumber}>5000/10000</h3>
                    <div className={styles.meterLevel}></div>
                </div>
                <div className={`${styles.buttonContainer} ${styles.buttonNotAvailableYet}`}>

                <button className={`${styles.button}`}>LEVEL 2</button>
                <button className={`${styles.button}`}>BUY NOW</button>
                </div>
            </div>
        </div>
        <div className={styles.baseContainer}>
            <div className={styles.left}>
            <Image
            src={"/images/base3.png"}
            className={styles.baseImage}
            width={200}
            height={200}
            alt="Base Image"
          />

            </div>
            <div className={styles.right}>
                <h3 className={styles.baseName}>BASE NAME HERE</h3>
                <div className={styles.levelContainer}>
                    <h4 className={styles.level}>LEVEL 3</h4>
                    <h4 className={styles.requirement}>REQUIRE 20,000 TOTAL KILLS</h4>
                </div>

                <div className={styles.meterContainer}>
                    <h3 className={styles.meterNumber}>5000/20000</h3>
                    <div className={styles.meterLevel}></div>
                </div>
                <div className={`${styles.buttonContainer} ${styles.buttonNotAvailableYet}`}>

                <button className={`${styles.button}`}>LEVEL 3</button>
                <button className={`${styles.button}`}>BUY NOW</button>
                </div>
            </div>
        </div>
        <div className={styles.baseContainer}>
            <div className={styles.left}>
            <Image
            src={"/images/base4.png"}
            className={styles.baseImage}
            width={200}
            height={200}
            alt="Base Image"
          />

            </div>
            <div className={styles.right}>
                <h3 className={styles.baseName}>BASE NAME HERE</h3>
                <div className={styles.levelContainer}>
                    <h4 className={styles.level}>LEVEL 4</h4>
                    <h4 className={styles.requirement}>REQUIRE 40,000 TOTAL KILLS</h4>
                </div>

                <div className={styles.meterContainer}>
                    <h3 className={styles.meterNumber}>5000/40000</h3>
                    <div className={styles.meterLevel}></div>
                </div>
                <div className={`${styles.buttonContainer} ${styles.buttonNotAvailableYet}`}>

                <button className={`${styles.button}`}>LEVEL 4</button>
                <button className={`${styles.button}`}>BUY NOW</button>
                </div>
            </div>
        </div>

    </div>
    </div>
  )
}

export default bases