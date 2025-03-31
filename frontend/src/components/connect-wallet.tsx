import React from "react";
import { Select } from "@stellar/design-system";
import { TESTNET_DETAILS } from "@/utils/stellar";
import {
  StellarWalletsKit,
  ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";
import { Button } from "./ui/button";

export const ConnectWallet = ({
  onSelectWallet,
  publicKey,
  SWKKit
}: {
  onSelectWallet: (params: {
    publicKey: string;
    walletId: string;
  }) => void;
  publicKey: string | null;
  SWKKit: StellarWalletsKit;
}) => {
  const [selectedNetwork] = React.useState(TESTNET_DETAILS);


  const onConnectWallet = async () => {
    // setConnectionError(null);

    // See https://github.com/Creit-Tech/Stellar-Wallets-Kit/tree/main for more options
    if (!publicKey) {
      await SWKKit.openModal({

        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            // Set selected wallet,  network, and public key
            SWKKit.setWallet(option.id);
            const newPubKey = await SWKKit.getAddress();

            onSelectWallet({
              publicKey: newPubKey.address,
              walletId: option.id,
            });
          } catch (error) {
            console.log(error);
            // setConnectionError(ERRORS.WALLET_CONNECTION_REJECTED);
          }
        },
      });
    }
  };

  const trimedPubKey =
    publicKey &&
    `${publicKey.substring(0, 3)}....${publicKey.substring(publicKey.length - 3)}`;
  const buttonText = trimedPubKey || "Connect Wallet";
  return (
    <div className="flex gap-4 items-center">
      <Select
        disabled
        fieldSize="md"
        id="selected-network"
        value={selectedNetwork.network}
      >
        <option>{selectedNetwork.network}</option>
      </Select>
      <Button onClick={onConnectWallet}>
        {buttonText}
      </Button>
    </div>
  );
};
