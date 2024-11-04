import React, { useEffect, useState } from "react";
import styles from "@/styles/Shop.module.css";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import TonConnectContainer from "../../components/TonConnectContainer";
import MakePayment from "../../components/MakePayment";

const shop = () => {
  const [cart, setCart] = useState({
    rods: [],
    baits: [],
    tools: [],
    powerUps: [],
  });

  const [user, setUser] = useState();

  const [loading, setLoading] = useState(false);

  const priceData = {
    basicRod: 2,
    advancedRod: 5,
    premiumRod: 10,
    basicBait: 2,
    specialBait: 5,
    liveBait: 10,
    hook: 20, // 10 hooks for 20 coins
    basicReel: 20, //10 for 20
    highSpeedReel: 50, //10 for 50
    standardLine: 20, //10 for 20
    heavyDutyLine: 50, //10 for 50
    sonarScan: 25,
    weatherControl: 25,
    speedBoost: 25,
    sturdyLine: 25,
  };

  const [view, setView] = useState("tokens");

  const [creatingPayment, setCreatingPayment] = useState(false);

  const cartUpdate = (itemType, itemName, action) => {
    setCart((prevCart) => {
      let updatedCart = { ...prevCart };
      let currentItems = [...updatedCart[itemType]];
      const itemIndex = currentItems.findIndex((item) => item[itemName]);

      if (itemIndex > -1) {
        const updatedItem = { ...currentItems[itemIndex] };
        const currentQuantity = updatedItem[itemName];

        if (action === "add") {
          updatedItem[itemName] = currentQuantity + 1;
        } else if (action === "remove") {
          updatedItem[itemName] = currentQuantity - 1;

          if (updatedItem[itemName] <= 0) {
            currentItems.splice(itemIndex, 1);
          }
        }

        if (updatedItem[itemName] > 0) {
          currentItems[itemIndex] = updatedItem;
        }
      } else if (action === "add") {
        currentItems.push({ [itemName]: 1 });
      }

      updatedCart[itemType] = currentItems;
      return updatedCart;
    });
  };

  const getItemQuantity = (itemType, itemName) => {
    const currentItems = cart[itemType];
    const item = currentItems.find((item) => item[itemName]);
    return item ? item[itemName] : 0;
  };

  const calculateTotalForItem = (itemName, quantity) => {
    const pricePerItem = priceData[itemName] || 0;
    return quantity * pricePerItem;
  };

  const calculateGrandTotal = () => {
    let total = 0;

    ["rods", "baits", "tools", "powerUps"].forEach((itemType) => {
      cart[itemType].forEach((item) => {
        const itemName = Object.keys(item)[0];
        const quantity = item[itemName];
        total += calculateTotalForItem(itemName, quantity);
      });
    });

    return total;
  };

  const renderBillBody = (itemType) => {
    return cart[itemType]
      .filter((item) => {
        const itemName = Object.keys(item)[0];
        return item[itemName] > 0;
      })
      .map((item, index) => {
        const itemName = Object.keys(item)[0];
        const quantity = item[itemName];
        const total = calculateTotalForItem(itemName, quantity);

        return (
          <div className={styles.billBody} key={index}>
            <div className={styles.col}>{itemName.toUpperCase()}</div>
            <div className={styles.col}>{quantity}</div>
            <div className={styles.col}>{isNaN(total) ? 0 : total}</div>
          </div>
        );
      });
  };

  const rodItemContainer = () => {
    return (
      <div className={styles.itemList}>
        {/* BASIC ROD */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/basicRod.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Basic Rod Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>BASIC ROD</h3>
            <p className={styles.itemSubHeading}>Basic rod for beginners</p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>2</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("rods", "basicRod", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("rods", "basicRod")}
                </h3>
                <div
                  onClick={() => cartUpdate("rods", "basicRod", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Rod */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/advancedRod.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Advanced Rod Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>ADVANCED ROD</h3>
            <p className={styles.itemSubHeading}>
              Enhanced rod for experienced fishers
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>5</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("rods", "advancedRod", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("rods", "advancedRod")}
                </h3>
                <div
                  onClick={() => cartUpdate("rods", "advancedRod", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Rod */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/premiumRod.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Premium Rod Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>PREMIUM ROD</h3>
            <p className={styles.itemSubHeading}>
              Top-tier rod for expert anglers
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>10</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("rods", "premiumRod", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("rods", "premiumRod")}
                </h3>
                <div
                  onClick={() => cartUpdate("rods", "premiumRod", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const baitItemContainer = () => {
    return (
      <div className={styles.itemList}>
        {/* BASIC BAIT */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/basicBait.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Basic Bait Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>BASIC BAIT</h3>
            <p className={styles.itemSubHeading}>
              Standard bait for basic fishing
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>2</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("baits", "basicBait", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("baits", "basicBait")}
                </h3>
                <div
                  onClick={() => cartUpdate("baits", "basicBait", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SPECIAL BAIT */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/specialBait.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Special Bait Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>SPECIAL BAIT</h3>
            <p className={styles.itemSubHeading}>
              Advanced bait for special catches
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>5</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("baits", "specialBait", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("baits", "specialBait")}
                </h3>
                <div
                  onClick={() => cartUpdate("baits", "specialBait", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE BAIT */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/liveBait.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Live Bait Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>LIVE BAIT</h3>
            <p className={styles.itemSubHeading}>
              Attract more fish with live bait
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>10</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("baits", "liveBait", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("baits", "liveBait")}
                </h3>
                <div
                  onClick={() => cartUpdate("baits", "liveBait", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const toolItemContainer = () => {
    return (
      <div className={styles.itemList}>
        {/* HOOK */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/hook.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Hook Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>HOOK (10-Pack)</h3>
            <p className={styles.itemSubHeading}>
              Get 10 hooks for 50 Catch Coins
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>50</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("tools", "hook", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("tools", "hook")}
                </h3>
                <div
                  onClick={() => cartUpdate("tools", "hook", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BASIC REEL */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/basicReelIcon.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Basic Reel Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>BASIC REEL (10-Pack)</h3>
            <p className={styles.itemSubHeading}>
              Standard reel for basic fishing
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>20</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("tools", "basicReel", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("tools", "basicReel")}
                </h3>
                <div
                  onClick={() => cartUpdate("tools", "basicReel", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HIGH-SPEED REEL */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/highSpeedReelIcon.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="High-Speed Reel Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>HIGH-SPEED REEL (10-Pack)</h3>
            <p className={styles.itemSubHeading}>
              Reel in fish faster with this high-speed reel
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>50</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("tools", "highSpeedReel", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("tools", "highSpeedReel")}
                </h3>
                <div
                  onClick={() => cartUpdate("tools", "highSpeedReel", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STANDARD LINE */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/standardLineIcon.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Standard Line Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>STANDARD LINE (10-Pack)</h3>
            <p className={styles.itemSubHeading}>
              Strong line for basic fishing needs
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>20</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("tools", "standardLine", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("tools", "standardLine")}
                </h3>
                <div
                  onClick={() => cartUpdate("tools", "standardLine", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HEAVY DUTY LINE */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/heavyDutyLineIcon.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Heavy Duty Line Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>HEAVY DUTY LINE (10-Pack)</h3>
            <p className={styles.itemSubHeading}>
              Extra strength line for bigger catches
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>50</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("tools", "heavyDutyLine", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("tools", "heavyDutyLine")}
                </h3>
                <div
                  onClick={() => cartUpdate("tools", "heavyDutyLine", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const powerUpItemContainer = () => {
    return (
      <div className={styles.itemList}>
        {/* SONAR SCAN */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/sonarScan.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Sonar Scan Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>SONAR SCAN</h3>
            <p className={styles.itemSubHeading}>
              Locate fish more easily with this scan
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("powerUps", "sonarScan", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("powerUps", "sonarScan")}
                </h3>
                <div
                  onClick={() => cartUpdate("powerUps", "sonarScan", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WEATHER CONTROL */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/weatherControl.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Weather Control Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>WEATHER CONTROL</h3>
            <p className={styles.itemSubHeading}>
              Control the weather for better fishing conditions
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() =>
                    cartUpdate("powerUps", "weatherControl", "add")
                  }
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("powerUps", "weatherControl")}
                </h3>
                <div
                  onClick={() =>
                    cartUpdate("powerUps", "weatherControl", "remove")
                  }
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SPEED BOOST */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/speedBoost.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Speed Boost Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>SPEED BOOST</h3>
            <p className={styles.itemSubHeading}>
              Boost your fishing speed with this power-up
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("powerUps", "speedBoost", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("powerUps", "speedBoost")}
                </h3>
                <div
                  onClick={() => cartUpdate("powerUps", "speedBoost", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STURDY LINE */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/sturdyLine.png"}
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Sturdy Line Image"
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>STURDY LINE</h3>
            <p className={styles.itemSubHeading}>
              Use this sturdy line for bigger catches
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.catchToken}>
                <Image
                  src={"/images/catchToken.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Catch Token"
                />
                <h4 className={styles.tokenNumber}>25</h4>
              </div>
              <div className={styles.quantityContainer}>
                <div
                  onClick={() => cartUpdate("powerUps", "sturdyLine", "add")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-plus"></i>
                </div>
                <h3 className={styles.quantityNum}>
                  {getItemQuantity("powerUps", "sturdyLine")}
                </h3>
                <div
                  onClick={() => cartUpdate("powerUps", "sturdyLine", "remove")}
                  className={styles.quantityButton}
                >
                  <i className="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tokenItemContainer = () => {
    return (
      <div className={styles.itemList}>
        {/* 50,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>50,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>No discount</p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>5</h4>
              </div>
              <MakePayment
                amount={0.00005} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("5", "USD", "50,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 100,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>100,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              5% discount 5,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>9.50</h4>
              </div>
              <MakePayment
                amount={9} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("9.5", "USD", "105,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 250,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>250,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              10% Discount 25,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>22.5</h4>
              </div>
              <MakePayment
                amount={22} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("22.5", "USD", "275,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 500,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>500,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              15% Discount 75,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>42.50</h4>
              </div>
              <MakePayment
                amount={42} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("42.5", "USD", "575,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 1,000,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>1,000,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              20% Discount 200,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>78</h4>
              </div>
              <MakePayment
                amount={78} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("78", "USD", "1,200,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2,500,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>2,500,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              25% Discount 625,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>190</h4>
              </div>
              <MakePayment
                amount={190} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("190", "USD", "3,125,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5,000,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>5,000,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              30% Discount 1,500,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>350</h4>
              </div>
              <MakePayment
                amount={350} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("350", "USD", "6,500,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 10,000,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>10,000,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              32% Discount 3,200,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>680</h4>
              </div>
              <MakePayment
                amount={680} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () => handleBuyCrypto("680", "USD", "3,200,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 15,000,000 Cosmic Tokens */}
        <div className={styles.itemContainer}>
          <div className={styles.itemLeft}>
            <Image
              src={"/images/cosmicToken.png"} // Updated image path
              className={styles.itemImage}
              width={92}
              height={92}
              alt="Catch Token Image" // Updated alt text
            />
          </div>
          <div className={styles.itemRight}>
            <h3 className={styles.itemHeading}>15,000,000 Cosmic Tokens</h3>{" "}
            {/* Updated name */}
            <p className={styles.itemSubHeading}>
              35% Discount 5,250,000 Bonus Tokens
            </p>
            <div className={styles.itemDetail}>
              <div className={styles.herbToken}>
                <Image
                  src={"/images/dollarIcon.png"}
                  className={styles.itemCoinImage}
                  width={30}
                  height={30}
                  alt="Dollar Icon"
                />
                <h4 className={styles.tokenNumber}>1,000</h4>
              </div>
              <MakePayment
                amount={1000} // Amount in NanoTONs
                onSuccess={() => getUserData()}
              />
              {creatingPayment ? (
                <div className={styles.buyButton}>
                  <i className="bx bx-loader-alt bx-spin"></i>
                </div>
              ) : (
                <div
                  onClick={
                    () =>
                      handleBuyCrypto("1000", "USD", "20,250,000 Catch Token") // Updated name
                  }
                  className={styles.buyButton}
                >
                  BUY NOW
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleViewChange = (value, index) => {
    setView(value);
    const buttons = document.getElementsByClassName(styles.button);
    for (let i = 0; i < buttons.length; i++) {
      const element = buttons[i];
      element.classList.remove(styles.buttonActive);
    }
    buttons[index].classList.add(styles.buttonActive);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    let userId;
    let username;
    if (window.Telegram.WebApp.initDataUnsafe.user) {
      userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      username = window.Telegram.WebApp.initDataUnsafe.user.username;
    } else {
      userId = "testingid";
      username = "navwebdev";
    }
    const cartData = {
      rods: cart.rods,
      baits: cart.baits,
      tools: cart.tools,
      powerUps: cart.powerUps,
      userId,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Purchase successful!", {
          position: toast.POSITION,
          autoClose: 5000,
        });
        setCart({
          rods: [],
          baits: [],
          tools: [],
          powerUps: [],
        });
        setLoading(false);
        setUser(data.updatedUser);
      } else {
        toast.error(`${data.message}`, {
          position: toast.POSITION,
          autoClose: 5000,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong, please try again.", {
        position: toast.POSITION,
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  const handleBuyCrypto = async (price, currency, productName) => {
    // let userId;

    // // Check if user is coming from Telegram
    // if (window.Telegram.WebApp.initDataUnsafe.user) {
    //   userId = window.Telegram.WebApp.initDataUnsafe.user.id;
    // } else {
    //   userId = "testingid"; // Fallback user ID for testing
    // }

    // try {
    //   setCreatingPayment(true);
    //   // Call the backend to create a Coinbase payment
    //   const response = await fetch("/api/create-payment", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       amount: price,
    //       currency: currency,
    //       productName: productName,
    //       userId: userId, // Pass the userId from Telegram or testing ID
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     // Redirect the user to the Coinbase-hosted payment page
    //     if (window.Telegram.WebApp) {
    //       window.Telegram.WebApp.openLink(data.paymentUrl);
    //     } else {
    //       window.location.href = data.paymentUrl;
    //     }

    //     setCreatingPayment(false);
    //   } else {
    //     setCreatingPayment(false);
    //     console.log("Something Went Wrong, Payment Not Created");
    //   }
    // } catch (error) {
    //   setCreatingPayment(false);
    //   console.error("Error creating payment:", error);
    // }
  };

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
      // setMag(data.user.mag);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const login = async () => {
    let userId;

    if (window.Telegram.WebApp.initDataUnsafe.user) {
      userId = window.Telegram.WebApp.initDataUnsafe.user.id;
    } else {
      userId = "testingid";
    }

    try {
      const response = await fetch("/api/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  useEffect(() => {
    login();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link className={styles.backButton} href={"/"}>
          <i class="bx bx-arrow-back"></i>
          Back
        </Link>

        <TonConnectContainer />

        <div className={styles.coinWrapper}>
          <div className={styles.coinContainer}>
            <Image
              src={"/images/cosmicToken.png"}
              classNam={styles.coinImage}
              width={40}
              height={40}
            />
            <h4 className={styles.coinNumber}>{user && user.cosmicToken}</h4>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {/* <button
          onClick={() => handleViewChange("rods", 0)}
          className={`${styles.button} ${styles.button1} ${styles.buttonActive}`}
        >
          Rods
        </button>
        <button
          onClick={() => handleViewChange("baits", 1)}
          className={`${styles.button} ${styles.button2}`}
        >
          Baits
        </button>
        <button
          onClick={() => handleViewChange("tools", 2)}
          className={`${styles.button} ${styles.button2}`}
        >
          Tools
        </button>
        <button
          onClick={() => handleViewChange("powerUps", 3)}
          className={`${styles.button} ${styles.button2}`}
        >
          Power-Ups
        </button> */}
        <button
          onClick={() => handleViewChange("tokens", 0)}
          className={`${styles.button} ${styles.button2}`}
        >
          Tokens
        </button>
        {/* Commenting out Tokens */}
        {/* <button
          onClick={() => handleViewChange("tokens", 4)}
          className={`${styles.button} ${styles.button2}`}
        >
          Tokens
        </button> */}
      </div>
      {view == "rods" && rodItemContainer()}
      {view == "baits" && baitItemContainer()}
      {view == "tools" && toolItemContainer()}
      {view == "powerUps" && powerUpItemContainer()}
      {view == "tokens" && tokenItemContainer()}
      {(view == "rods" ||
        view == "baits" ||
        view == "tools" ||
        view == "powerUps") && (
        <div className={styles.billWrapper}>
          <div className={styles.bill}>
            <h4 className={styles.billHeading}>RECEIPT</h4>
            <div className={styles.billHeader}>
              <div className={styles.col}>NAME</div>
              <div className={styles.col}>QUANTITY</div>
              <div className={styles.col}>TOTAL</div>
            </div>
            {renderBillBody("rods")}
            {renderBillBody("baits")}
            {renderBillBody("tools")}
            {renderBillBody("powerUps")}
            <div className={styles.billFooter}>
              Grand Total: {calculateGrandTotal()}
            </div>
          </div>
          {(cart.rods.length > 0 ||
            cart.baits.length > 0 ||
            cart.tools.length > 0 ||
            cart.powerUps.length > 0) &&
            (loading ? (
              <div className={styles.checkoutButton}>
                <i className="bx bx-loader-alt bx-spin"></i>
              </div>
            ) : (
              <div onClick={handleCheckOut} className={styles.checkoutButton}>
                CHECKOUT
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default shop;
