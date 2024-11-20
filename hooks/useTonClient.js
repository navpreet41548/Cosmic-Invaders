import { TonClient } from "@ton/ton";
import { CHAIN } from "@tonconnect/ui-react";
import { useState, useEffect } from "react";
import { useTonConnect } from "./useTonConnect";
import { getHttpEndpoint } from "@orbs-network/ton-access";

export const useAsyncInitialize = (func, deps = []) => {
  const [state, setState] = useState();

  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
};

export const useTonClient = () => {
  const { network } = useTonConnect();
  const [client, setClient] = useState();

  useAsyncInitialize(async () => {
    if (!network) return;

    console.log("Network", network);
    const endpoint = await getHttpEndpoint({
      network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
    });

    console.log("endpoint", endpoint);

    const tonClient = new TonClient({ endpoint });
    setClient(tonClient);
  }, [network]);

  return {
    client,
  };
};
