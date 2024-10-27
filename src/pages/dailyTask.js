import React, { useEffect, useState } from "react";
import styles from "@/styles/DailyTask.module.css";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";

const dailyTask = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const getUserData = async () => {
    let userId = window.Telegram.WebApp.initDataUnsafe?.user?.id || "testingid";

    try {
      const response = await fetch("/api/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handlePlayNowClick = async (url, taskName) => {
    let userId = window.Telegram.WebApp.initDataUnsafe?.user?.id || "testingid";
    setLoading(true);
    try {
      const response = await fetch("/api/dailyTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, taskName }),
      });

      if (response.ok) {
        // Display success notification
        // toast.success("Reward Collected!!", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 5000,
        // });

        // Redirect to the game
        window.location.href = url;
        setLoading(false);
      } else {
        const errorData = await response.json();
        // toast.error(errorData.error || "Failed to collect reward.", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 5000,
        // });
        console.error("Failed to collect reward");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error completing task:", error);
      // toast.error("Something went wrong!", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 5000,
      // });
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link className={styles.backButton} href={"/"}>
          <i class="bx bx-arrow-back"></i>
          Back
        </Link>
        <div className={styles.coinWrapper}>
          <div className={styles.coinContainer}>
            <Image
              src={"/images/cosmicToken.png"}
              className={styles.coinImage}
              width={40}
              height={40}
            />
            <h4 className={styles.coinNumber}>{user && user.cosmicToken}</h4>
          </div>
        </div>
      </div>

      <div className={styles.itemList}>
        {/* Quack Attack */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/dailyTask/quackAttack.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>Quack Attack</h3>
            <p className={styles.itemSubHeading}>Play Now to win 25 $BLOCK</p>
            <div className={styles.itemDetail}>
              {loading ? (
                <button className={styles.linkButton}>
                  <i class="bx bx-loader-alt bx-spin"></i>
                </button>
              ) : (
                <button
                  className={styles.linkButton}
                  onClick={() =>
                    handlePlayNowClick(
                      "https://t.me/quack_attack_bot/quack_attack",
                      "Quack Attack"
                    )
                  }
                >
                  PLAY NOW
                </button>
              )}
              <div className={styles.rewardTokenContainer}>
                <Image
                  src={"/images/cosmicToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Herb Haven */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/dailyTask/herbHaven.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>Herb Haven</h3>
            <p className={styles.itemSubHeading}>Play Now to win 25 $BLOCK</p>
            <div className={styles.itemDetail}>
              {loading ? (
                <button className={styles.linkButton}>
                  <i class="bx bx-loader-alt bx-spin"></i>
                </button>
              ) : (
                <button
                  className={styles.linkButton}
                  onClick={() =>
                    handlePlayNowClick(
                      "https://t.me/herb_haven_bot/herb_haven",
                      "Herb Haven"
                    )
                  }
                >
                  PLAY NOW
                </button>
              )}
              <div className={styles.rewardTokenContainer}>
                <Image
                  src={"/images/cosmicToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Lucky Spin */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/dailyTask/luckySpin.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>Lucky Spin</h3>
            <p className={styles.itemSubHeading}>Play Now to win 25 $BLOCK</p>
            <div className={styles.itemDetail}>
              {loading ? (
                <button className={styles.linkButton}>
                  <i class="bx bx-loader-alt bx-spin"></i>
                </button>
              ) : (
                <button
                  className={styles.linkButton}
                  onClick={() =>
                    handlePlayNowClick(
                      "https://t.me/lucky_spins_wheel_bot/luckyspins",
                      "Lucky Spin"
                    )
                  }
                >
                  PLAY NOW
                </button>
              )}
              <div className={styles.rewardTokenContainer}>
                <Image
                  src={"/images/cosmicToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Big Catch */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/dailyTask/bigCatch.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>Big Catch</h3>
            <p className={styles.itemSubHeading}>Play Now to win 25 $BLOCK</p>
            <div className={styles.itemDetail}>
              {loading ? (
                <button className={styles.linkButton}>
                  <i class="bx bx-loader-alt bx-spin"></i>
                </button>
              ) : (
                <button
                  className={styles.linkButton}
                  onClick={() =>
                    handlePlayNowClick(
                      "https://t.me/big_catch_bot/bigcatch",
                      "Big Catch"
                    )
                  }
                >
                  PLAY NOW
                </button>
              )}
              <div className={styles.rewardTokenContainer}>
                <Image
                  src={"/images/cosmicToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
            </div>
          </div>
        </div>
        {/* Tiktok  */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/dailyTask/tiktok.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Tiktok Logo"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>Tiktok</h3>
            <p className={styles.itemSubHeading}>Follow up to win 25 $BLOCK</p>
            <div className={styles.itemDetail}>
              {loading ? (
                <button className={styles.linkButton}>
                  <i class="bx bx-loader-alt bx-spin"></i>
                </button>
              ) : (
                <button
                  className={styles.linkButton}
                  onClick={() =>
                    handlePlayNowClick(
                      "https://www.tiktok.com/@prolificgamesstudio",
                      "Tiktok"
                    )
                  }
                >
                  FOLLOW
                </button>
              )}
              <div className={styles.rewardTokenContainer}>
                <Image
                  src={"/images/cosmicToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dailyTask;
