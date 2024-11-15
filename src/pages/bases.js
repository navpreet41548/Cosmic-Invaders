import styles from "@/styles/Bases.module.css";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Bases = () => {
  const [user, setUser] = useState(null); // Store user data
  const [totalKills, setTotalKills] = useState(0); // Store total kills
  const [bases, setBases] = useState([]); // Store bases data

  useEffect(() => {
    const fetchUserData = async () => {
      let userId;

      if (window.Telegram.WebApp.initDataUnsafe.user) {
        userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      } else {
        userId = "testingid";
      }

      try {
        const response = await fetch("/api/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        setUser(data.user);
        setTotalKills(data.user.totalKills || 0); // Set total kills from user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchBasesData = async () => {
      // Simulated data for bases
      const basesData = [
        {
          name: "Base 1",
          level: 1,
          requirement: 0,
          image: "/images/base1.png",
        },
        {
          name: "Base 2",
          level: 2,
          requirement: 10000,
          image: "/images/base2.png",
        },
        {
          name: "Base 3",
          level: 3,
          requirement: 20000,
          image: "/images/base3.png",
        },
        {
          name: "Base 4",
          level: 4,
          requirement: 40000,
          image: "/images/base4.png",
        },
      ];

      setBases(basesData);
    };

    fetchUserData();
    fetchBasesData();
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
        {bases.map((base, index) => {
          const isUnlocked = totalKills >= base.requirement;
          return (
            <div className={styles.baseContainer} key={index}>
              <div className={styles.left}>
                <Image
                  src={base.image}
                  className={styles.baseImage}
                  width={200}
                  height={200}
                  alt={`${base.name} Image`}
                />
              </div>
              <div className={styles.right}>
                <h3 className={styles.baseName}>{base.name}</h3>
                <div className={styles.levelContainer}>
                  <h4 className={styles.level}>LEVEL {base.level}</h4>
                  <h4 className={styles.requirement}>
                    REQUIRE {base.requirement.toLocaleString()} TOTAL KILLS
                  </h4>
                </div>

                <div className={styles.meterContainer}>
                  <h3 className={styles.meterNumber}>
                    {Math.min(totalKills, base.requirement).toLocaleString()} /
                    {base.requirement.toLocaleString()}
                  </h3>
                  <div
                    className={styles.meterLevel}
                    style={{
                      width: `${Math.min(
                        (totalKills / base.requirement) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div
                  className={`${styles.buttonContainer} ${
                    isUnlocked ? "" : styles.buttonNotAvailableYet
                  }`}
                >
                  {isUnlocked ? (
                    <button className={styles.button}>EQUIPPED</button>
                  ) : (
                    <>
                      <button className={styles.button}>LEVEL {base.level}</button>
                      <button className={styles.button}>BUY NOW</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bases;
