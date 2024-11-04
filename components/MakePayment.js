import React, { useState, useEffect } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"; // Use hooks from TonConnect
import TonWeb from "tonweb";
import { toast } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import default styles
import styles from "@/styles/MakePayment.module.css";
import Image from "next/image";
import TonConnectContainer from "./TonConnectContainer";
const { Cell } = TonWeb.boc;

// Function to fetch TON to USD rate (hardcoded as an example)
const fetchTonToUsdRate = async () => {
  // Example API call to get TON to USD exchange rate
  const tonToUsdRate = 5; // Example rate: 1 TON = $2.50 (You can replace this with actual API fetch)
  return tonToUsdRate;
};

// Function to convert dollar amount to NanoTON
const convertDollarToNanoTon = async (dollarAmount) => {
  const tonToUsdRate = await fetchTonToUsdRate();
  const tonAmount = dollarAmount / tonToUsdRate; // Convert dollars to TON
  const nanoTonAmount = tonAmount * 1e9; // Convert TON to NanoTON (1 TON = 1e9 NanoTON)
  return Math.floor(nanoTonAmount); // Return NanoTON value
};

const MakePayment = ({ amount, onSuccess, onFailure }) => {
  let recipientAddress = process.env.NEXT_PUBLIC_SHOP_WALLET;
  const [tonConnectUI] = useTonConnectUI(); // Access TonConnect UI SDK
  const wallet = useTonWallet(); // Get the connected wallet
  const [isProcessing, setIsProcessing] = useState(false); // To manage UI states during transaction
  const [isWalletConnected, setIsWalletConnected] = useState(false); // To track if wallet is connected

  // Detect wallet changes and handle state updates
  useEffect(() => {
    if (wallet) {
      // If wallet is connected or changes, set state
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [wallet]); // Runs whenever wallet changes

  // Function to get userId from Telegram WebApp or use default values
  const getUserInfo = () => {
    let userId, username;
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      username = window.Telegram.WebApp.initDataUnsafe.user.username;
    } else {
      userId = "testingid";
      username = "navwebdev";
    }
    return { userId, username };
  };

  // Function to generate a random string
  const generateRandomString = (length = 6) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const MAX_BOC_SIZE = 1024; // Define a size limit in bytes as a constraint

  const createCustomPayload = async (message) => {
    let a = new TonWeb.boc.Cell();
    a.bits.writeUint(0, 32);
    a.bits.writeString("TON Connect 2 tutorial!");
    let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

    return payload;
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const decodeBOC = async (bocBase64) => {
    const cell = Cell.fromBoc(Buffer.from(bocBase64, 'base64'))[0];
    console.log("Decoded BOC:", cell);
    return cell;
  };

  const testing = async () =>{
   const boc = "te6cckEBBAEA0AAB5YgBo5JtjO8doOnuGga1Rk936f5WvFgMvyy6t3MJgbOkySQDm0s7c///+Is4MMnIAAAAdBLIM5JhYWHk89As3/Cmp7FBsGT+NPr2BrpZutsfz7Z1dHZSmpOZ/L/6nEnMVJhbeINnV3UzdrSP8rG53/WOig0BAgoOw8htAwMCAJpCAE6h970LGRZ0+noiUYei2dozAnKpFrq6CEZK7IGhinRdkTiAAAAAAAAAAAAAAAAAAAAAAABUT04gQ29ubmVjdCAyIHR1dG9yaWFsIQAA/j6kNw=="
    const decodedCell = await decodeBOC(boc);
    console.log(decodedCell)
  }



  // Convert dollar amount to NanoTON
  // Function to make a transaction
  const makeTransaction = async () => {
    const nanoTonAmount = await convertDollarToNanoTon(amount);
    const { userId } = getUserInfo();
    const randomString = generateRandomString(); // Generate random string once
    const customMessage = `${userId}!${nanoTonAmount}!${randomString}`; // Ensure this is generated once
    const customPayload = await createCustomPayload(customMessage);

    if (!recipientAddress || !amount || !wallet) {
      console.error("Recipient address, amount, or wallet is missing");
      return;
    }

    setIsProcessing(true);

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 5 * 60, // Transaction valid for 5 minutes
      messages: [
        {
          address: recipientAddress,
          amount: nanoTonAmount.toString(), // Set the amount in NanoTON
          payload: customPayload,
        },
      ],
    };

    const loadingToastId = toast.loading(
      "Processing, This can take 1-2 mins, Please Don't Refresh or leave the page"
    );
    try {
      const tx = await tonConnectUI.sendTransaction(transaction);
      console.log("Transaction successful:", tx);

      if (tx.boc) {
        const decodedCell = await decodeBOC(tx.boc);
        console.log(decodedCell)
        // You can now use `decodedCell` for any additional processing
      }


      await delay(60000); // 60 seconds delay

      await toast.promise(
        verifyTransactionOnBackend(
          wallet.account.address,
          nanoTonAmount, // Send the converted NanoTON amount
          recipientAddress,
          customMessage // Pass the same customMessage to verification
        ),
        {
          pending: "Verifying transaction...",
          success: "Transaction verified successfully!",
          error: "Transaction verification failed.",
        }
      );
      toast.dismiss(loadingToastId);
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Please try again.");
      toast.dismiss(loadingToastId);
    } finally {
      toast.dismiss(loadingToastId);
      setIsProcessing(false);
    }
  };

  // Function to call backend API to verify transaction
  const verifyTransactionOnBackend = async (
    walletAddress,
    nanoTonAmount,
    recipientAddress,
    customMessage
  ) => {
    try {
      const response = await fetch("/api/tonWallet/verifyTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          amount: nanoTonAmount, // Send the NanoTON amount to the backend
          recipientAddress,
          payload: customMessage, // Send the same customMessage
        }),
      });

      const data = await response.json();
      if (response.ok && data.verified) {
        onSuccess();
        return Promise.resolve(); // Resolve the promise on success
      } else {
        return Promise.reject(new Error(data.message)); // Reject on failure
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      return Promise.reject(error); // Reject the promise on error
    }
  };

  return (
    <>
      {isWalletConnected  ? (
        <>
     <button
          className={styles.button}
          // onClick={makeTransaction}
          disabled={isProcessing}
          >
          <Image
            className={styles.buttonIcon}
            src={"/images/ton_symbol.png"}
            width={50}
            height={50}
            alt="TON ICON"
            />
          {isProcessing ? "Wait" : "Pay"}
        </button>
          <button onClick={testing}></button>
            </>
      ) : (
        <></>
      )}
    </>
  
  );
};

export default MakePayment;
