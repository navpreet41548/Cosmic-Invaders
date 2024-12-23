import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const Header = ({ user }) => {

  const [showVideoContainer, setShowVideoContainer] = useState(true);


  
  useEffect(() => {
    if (user) {
      const isNewUser = user.createdAt && user.updatedAt
        ? user.createdAt === user.updatedAt
        : !!user.createdAt;

      setShowVideoContainer(isNewUser);
    }
  }, [user]);

  
  const toggleDropDown = (index) => {
    const dropDowns = document.getElementsByClassName(styles.dropdownContainer);
    const element = dropDowns[index];
    element.classList.toggle(styles.dropDownActive);
  };

  const handleCloseVideo = () => {
    setShowVideoContainer(false);
  };

  const handleShowVideo = () => {
    setShowVideoContainer(true);
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.headerLeftCol}>

        <Link href={"/shop"}>
          <Image
            className={styles.wideImage}
            src={"/images/shop.png"}
            width={100}
            height={60}
            alt="Bonus Image"
            />
        </Link>
        <Link href={"/bonus"}>
          <Image
            className={styles.wideImage}
            src={"/images/bonus.png"}
            width={100}
            height={60}
            alt="Bonus Image"
            />
        </Link>
            </div>
        <div className={styles.headerLeftCol}>

        <Link href={"/leaderboard"}>
          <Image
            className={styles.wideImage}
            src={"/images/leaderBoard.png"}
            width={100}
            height={60}
            alt="Bonus Image"
            />
        </Link>
        <Link href={"/bases"}>
          <Image
            className={styles.wideImage}
            src={"/images/bases.png"}
            width={100}
            height={60}
            alt="Bonus Image"
            />
        </Link>
            </div>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.smallImageWrapper}>
          {/* <div
            onClick={() => toggleDropDown(0)}
            className={styles.smallImageContainer}
          >
            <Image
              className={styles.smallImage}
              src={"/images/powerUps.png"}
              width={40}
              height={40}
              alt="Power Ups"
            />
            <div className={styles.dropdownContainer}>
              <div className={styles.dropdownContainerRow}>
              <div className={styles.dropdownImageContainer}>
                <Image
                  className={styles.dropDownImage}
                  width={38}
                  height={38}
                  src={"/images/powerUps.png"}
                />
                <div className={styles.dropDownImageNumber}>
                  20
                </div>
              </div>
              <div className={styles.dropdownImageContainer}>
                <Image
                  className={styles.dropDownImage}
                  width={38}
                  height={38}
                  src={"/images/powerUps.png"}
                />
                <div className={styles.dropDownImageNumber}>
                20
                             </div>
              </div>
              
              </div>
             
             
            </div>
          </div>
           */}

          <Link href={"/refer"} className={styles.smallImageContainer}>
            <Image
              className={styles.smallImage}
              src={"/images/refer.png"}
              width={40}
              height={40}
              alt="Refer"
            />
          </Link>
          <div
            className={styles.smallImageContainer}
            onClick={handleShowVideo}
          >
            <Image
              className={styles.smallImage}
              src={"/images/howToPlay.png"}
              width={40}
              height={40}
              alt="How to play"
            />
          </div>
        </div>

        <div className={styles.coinWrapper}>
          <div className={styles.coinContainer}>
            <h4 className={styles.coinText}>{user && user.cosmicToken}</h4>
            {/* <h4 className={styles.coinText}>12</h4> */}
            <Image
              src={"/images/cosmicToken.png"}
              width={40}
              height={40}
              alt="Cosmic Token Image"
            />
          </div>
          <div className={styles.coinContainer}>
            <h4 className={styles.coinText}>{user && user.proCoin}</h4>
            {/* <h4 className={styles.coinText}>0</h4> */}

            {/* <h4 className={styles.coinText}>{12}</h4> */}
            <Image
              src={"/images/proCoin.png"}
              width={40}
              height={40}
              alt="Herb Token Image"
            />
          </div>
        </div>
      </div>

      {showVideoContainer && (
        <div className={styles.videoContainer}>
          <div className={styles.videoHeading}>How to play</div>
          <div className={styles.videoCross} onClick={handleCloseVideo}>
            <i className="bx bx-x"></i>
          </div>
          <video
            className={styles.video}
            src="/video/play.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}
    </div>
  );
};

export default Header;
