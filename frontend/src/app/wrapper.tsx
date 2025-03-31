"use client";

import {
  allowAllModules,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

import { ConnectWallet } from "@/components/connect-wallet";
import { ApiResponse } from "./page";
import ChatContainer from "@/components/chat-container";
import { useState } from "react";

export const Wrapper = ({
  handleSubmitAction,
}: {
  handleSubmitAction: (texts: string[], caller: string) => Promise<ApiResponse>;
}) => {
  const [publicKey, setPubKey] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string>(XBULL_ID);
  const [SWKKit] = useState<StellarWalletsKit>(
    new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: selectedWallet,
      modules: allowAllModules(),
    }),
  );
  const onSelectWallet = ({
    publicKey,
    walletId,
  }: {
    publicKey: string;
    walletId: string;
  }) => {
    setSelectedWallet(walletId);
    setPubKey(publicKey);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold">OlivIA</h1>
          <ConnectWallet
            onSelectWallet={onSelectWallet}
            publicKey={publicKey}
            SWKKit={SWKKit}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <ChatContainer
          handleSubmitAction={handleSubmitAction}
          publicKey={publicKey}
          SWKKit={SWKKit}
        />
      </main>
    </div>
  );
};

export default Wrapper;
