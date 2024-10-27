import React, { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";
import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";

const TonConnectContainer = () => {
  const wallet = useTonWallet(); // Hook to get the connected wallet information
  const [tonConnectUI] = useTonConnectUI(); // Hook to access the TonConnect UI API
  const [balance, setBalance] = useState(null); // To store the user's balance
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");

  // Connect wallet logic
  const handleConnect = async () => {
    try {
      // Attempt to connect the wallet
      const wallets = await tonConnectUI.connectWallet();

      if (wallets.length > 0) {
        // Get the selected wallet
        const wallet = wallets[0];
        const walletInfo = await wallet.connect();

        setWalletAddress(walletInfo.account.address); // Update with wallet address
        setPublicKey(walletInfo.publicKey); // Update with the public key
        setWalletConnected(true); // Set connection status

        // Fetch or set userId
        let userId;
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        } else {
          userId = "testingid"; // Fallback for testing
        }

        console.log("Wallet connected:", walletInfo);
      }
    } catch (error) {
      // Handle TonConnectError specifically
      if (
        error.name === "TonConnectError" &&
        error.message.includes("Operation aborted")
      ) {
        console.log("Connection operation was aborted by the user");
      } else {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  // Save wallet info to the backend
  const saveWalletInfo = async (walletAddress, publicKey, userId, username) => {
    try {
      const response = await fetch("/api/tonWallet/addWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          walletAddress,
          publicKey,
          username,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save wallet info");
      }

      console.log("Wallet info saved successfully:", result);
    } catch (error) {
      console.error("Error saving wallet info:", error);
    }
  };

  // Handle logic when the wallet is connected
  useEffect(() => {
    if (wallet) {
      let userId;
      let username;
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        username = window.Telegram.WebApp.initDataUnsafe.user.username;
      } else {
        userId = "testingid"; // Fallback userId for testing
        username = "navwebdev";
      }
      // // Call the saveWalletInfo function
      // saveWalletInfo(
      //   wallet.account.address,
      //   wallet.account.publicKey,
      //   userId,
      //   username
      // );
    }
  }, [wallet]);

  // Function to fetch wallet balance (as an example)
  const getBalance = async (wallet) => {
    try {
      const response = await fetch(
        `https://tonapi.io/v1/address/getBalance?address=${wallet.account.address}`
      );
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <>
      {/* Display the connect button if the wallet is not connected */}
      <TonConnectButton onClick={handleConnect} />
    </>
  );
};

export default TonConnectContainer;
