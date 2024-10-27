import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/refer.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";

const refer = () => {
  const [copyText, setCopyText] = useState("COPY");
  const [user, setUser] = useState();
  const [code, setCode] = useState("");
  const [initData, setInitData] = useState();
  const [message, setMessage] = useState("");

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
      // Get the current URL
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      let userId;
      let username;
      const userData = {
        username,
        userId, // make sure the key is "userId" as expected by the backend
      };

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
          const endpoint = "/api/getUser"; // Adjust this to your actual endpoint

          // Make the request to the login endpoint
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId }), // Send the userId as part of the request body
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
    // setTelegramUserData(window.Telegram.WebApp.initDataUnsafe.user);
    //  setTelegramUserData({ id: "testingid" });
    // if (window.Telegram.WebApp.initDataUnsafe.start_param) {
    //   setInitData(window.Telegram.WebApp.initDataUnsafe);
    // } else {
    //   setInitData({ start_param: "kajf34" });
    // }
  }, []);

  return (
    <>
      
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          {/* <Header showBackButton={true} user={user} /> */}
          <div className={styles.header}>
        <Link className={styles.backButton} href={"/"}>
          <i class="bx bx-arrow-back"></i>
          Back
        </Link>


        <div className={styles.coinWrapper}>
          <div className={styles.coinContainer}>
            <Image
              src={"/images/cosmicToken.png"}
              classNam={styles.coinImage}
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
            Referrers receive 3 $Cosmic per successful referral. Referees
            start with 3 $Cosmic.
          </p>

          <div className={styles.codeContainer}>
            <h3 className={styles.codeHeading}>Share this Url</h3>
            <h4 className={styles.codeSubHeading}>
              {user &&
                `https://t.me/block_builder_game_bot/blockBuilder?startapp=${user.referCode}`}
            </h4>
            <button
              className={styles.button}
              onClick={() =>
                handleCopy(
                  user &&
                    `https://t.me/block_builder_game_bot/blockBuilder?startapp=${user.referCode}`
                )
              }
            >
              {copyText}
            </button>
          </div>

          {/* <div className={styles.codeContainer}>
            <h3 className={styles.codeHeading}>ENTER CODE</h3>
            <input
              className={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleInvite} className={styles.button}>
              ENTER
            </button>
            <h4 className={styles.message}>{message}</h4>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default refer;
