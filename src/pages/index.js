import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Header from "../../components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import TonConnectContainer from "../../components/TonConnectContainer";
import { useTWAEvent } from '@tonsolutions/telemetree-react';


export default function Home() {
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

  useEffect(() => {
    login();
  }, []);


  return (
    <>
     
      <div className={styles.container}>
        <Header user={user} />
        <Image
          className={styles.homeMainImage}
          src={"/images/homeMain.png"}
          width={673}
          height={647}
          alt="Home Title Image"
        />
        <div className={styles.buttonContainer}>
          <Link href={"/play2"} className={styles.button}>
            PLAY
          </Link>
          <Link href={"/refer"} className={styles.button}>
            REFER
          </Link>
        </div>
        <div className={styles.buttonContainer2}>
          <Link href={"/dailyTask"} className={styles.button}>
            EARN $COSMIC
          </Link>

        </div>
        <div className={styles.buttonContainer2}>

        <TonConnectContainer />
        </div>
      </div>
    </>
  );
}
