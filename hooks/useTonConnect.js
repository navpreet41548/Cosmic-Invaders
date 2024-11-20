import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import {
  Address,
  beginCell,
  storeStateInit,
} from "@ton/core";

export const useTonConnect = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const walletAddress = wallet?.account?.address
    ? Address.parse(wallet.account.address)
    : null;

  return {
    sender: {
      send: async (args) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc()?.toString("base64"),
              stateInit: args.init
                ? beginCell()
                    .storeWritable(storeStateInit(args.init))
                    .endCell()
                    .toBoc()
                    .toString("base64")
                : undefined,
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
      address: walletAddress,
    },
    connected: !!wallet?.account?.address,
    walletAddress: walletAddress,
    network: wallet?.account?.chain || null,
    tonConnectUI,
  };
};
