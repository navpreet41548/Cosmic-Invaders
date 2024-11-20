import { useCallback, useState, useEffect } from "react";
import {
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  Address,
  beginCell,
  Cell,
  loadMessage,
  storeMessage,
} from "@ton/core";
import { useTonClient } from "../hooks/useTonClient";
import styles from "@/styles/MakePayment.module.css";
import Image from "next/image";

const waitForTransaction = async (options, client) => {
  const { hash, refetchInterval = 1000, refetchLimit, address } = options;

  return new Promise((resolve) => {
    let refetches = 0;
    const walletAddress = Address.parse(address);
    const interval = setInterval(async () => {
      refetches += 1;

      console.log("waiting transaction...");
      const state = await client.getContractState(walletAddress);
      if (!state || !state.lastTransaction) {
        clearInterval(interval);
        resolve(null);
        return;
      }
      const lastLt = state.lastTransaction.lt;
      const lastHash = state.lastTransaction.hash;
      const lastTx = await client.getTransaction(walletAddress, lastLt, lastHash);

      if (lastTx && lastTx.inMessage) {
        const msgCell = beginCell()
          .store(storeMessage(lastTx.inMessage))
          .endCell();

        const inMsgHash = msgCell.hash().toString("base64");
        console.log("InMsgHash", inMsgHash);
        if (inMsgHash === hash) {
          clearInterval(interval);
          resolve(lastTx);
        }
      }
      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(null);
      }
    }, refetchInterval);
  });
};

export default function MakePayment({ amount, itemType, userId, onSuccess }) {
  const [tx, setTx] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { client } = useTonClient();

  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();


  let recipientAddress = process.env.NEXT_PUBLIC_SHOP_WALLET;

  const fetchTonToUsdRate = () => {
    const tonToUsdRate = 5; // Example rate
    return tonToUsdRate;
  };

  const convertDollarToNanoTon = (dollarAmount) => {
    const tonToUsdRate = fetchTonToUsdRate();
    const tonAmount = dollarAmount / tonToUsdRate;
    const nanoTonAmount = tonAmount * 1e9;
    return Math.floor(nanoTonAmount);
  };

  useEffect(() => {
    if (amount) {
      setTx({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: recipientAddress,
            amount: convertDollarToNanoTon(amount),
            stateInit:
              "te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==",
            payload: "te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==",
          },
        ],
      });
    }
  }, [amount]);

  const createTransaction = async () => {
    try {
      const response = await fetch("/api/tonWallet/createTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount,
          itemType,
        }),
      });
  
      const data = await response.json();
      console.log("Create Transaction Response:", data); // Log the full response
      if (data.success) {
        setTransactionId(data.transactionId);
        console.log("Transaction created:", data.transactionId);
        return data.transactionId;
      } else {
        console.error("Failed to create transaction:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  };
  
  

  const updateTransaction = async (transactionId, transactionHash) => {
    try {
      const response = await fetch("/api/tonWallet/updateTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          transactionHash,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess()
        console.log("Transaction updated successfully:", data);
      } else {
        console.error("Failed to update transaction:", data.error);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="send-tx-form">
      {wallet ? (
        <button
          className={styles.button}
          disabled={loading || !tx}
          onClick={async () => {
            try {
              setLoading(true);

              // Create the transaction and get the transaction ID
              const createdTransactionId = await createTransaction();
              if (!createdTransactionId) {
                throw new Error("Failed to create transaction");
              }

              setTransactionId(createdTransactionId); // Update state for reference

              // Send the transaction
              const result = await tonConnectUi.sendTransaction(tx);
              const hash = Cell.fromBase64(result.boc)
                .hash()
                .toString("base64");

              if (client) {
                const txFinalized = await waitForTransaction(
                  {
                    address: tonConnectUi.account?.address || "",
                    hash: hash,
                  },
                  client
                );

                if (txFinalized) {
                  // Update the backend once the transaction is finalized
                  await updateTransaction(createdTransactionId, hash);
                }
              }
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          }}
        >
          <Image
            className={styles.buttonIcon}
            src="/images/ton_symbol.png"
            width="50"
            height="50"
            alt="Ton Coin"
          />
          {loading ? "WAIT" : "PAY"}
        </button>
      ) : (
        <button onClick={() => tonConnectUi.openModal()}>Connect wallet</button>
      )}
    </div>
  );
}