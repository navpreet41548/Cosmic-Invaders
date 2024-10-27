import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Play.module.css";
import Header from "../../components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import TonConnectContainer from "../../components/TonConnectContainer";
import { useTWAEvent } from '@tonsolutions/telemetree-react';


export default function Play() {
  // const eventBuilder = useTWAEvent();

  const [user, setUser] = useState();

  const login = async () => {
    let userId;
    let username;

    if (window.Telegram.WebApp.initDataUnsafe.user) {
      userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      username = window.Telegram.WebApp.initDataUnsafe.user.username;
    } else {
      userId = "testingid"; // Fallback for testing purposes
      username = "navwebdev"; // Fallback for testing purposes
    }

    let referCode;
    if (window.Telegram.WebApp.initDataUnsafe.start_param) {
      referCode = window.Telegram.WebApp.initDataUnsafe.start_param;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username, referCode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user);

      if (data.user.locations && levelName) {
        setHoles(data.user.locations[levelName] || {});
      }
    } catch (error) {
      console.error("User fetch failed:", error);
    }
  };

//   useEffect(() => {
//     login();
//   }, []);


  return (
    <>
     
      <div className={styles.container}>
      <Image src={"/images/playBg.png"} className={styles.bgImage} width={500} height={1000} alt={"Background Image"} />

<div className={styles.header}>
    <div className={styles.headerLeft}>
        <Link href="/">BACK</Link>
    </div>
    <div className={styles.headerRight}>
        <p className={styles.stat} href="/">ENEMY KILLED: 0</p>
        <p className={styles.stat} href="/">LEVEL: 1</p>

    </div>
</div>
<div className={styles.playArea} >
        <div className={styles.enemyArea}></div>
        <div className={styles.playerArea}></div>
        <div className={styles.buttonArea}>
            <button className={styles.button}><i className='bx bx-left-arrow-alt'></i></button>
            <button className={styles.button}><i className='bx bx-right-arrow-alt'></i></button>
        </div>
</div>

      </div>
    </>
  );
}
