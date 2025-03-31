"use client";

import {
  allowAllModules,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

import { ConnectWallet } from "@/components/connect-wallet";
import ChatContainer from "@/components/chat-container";
import { useState } from "react";
import { ApiResponse } from "../page";

export const MiniChatBot = ({
  handleSubmitAction,
}: {
  handleSubmitAction: (texts: string[], caller: string) => Promise<ApiResponse>;
}) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
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
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  if (!isChatbotOpen) {
    return (
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={toggleChatbot} 
          className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    );
  }
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background rounded-lg shadow-xl overflow-hidden flex flex-col border border-border">
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <h1 className="text-xl font-bold">OlivIA</h1>
        <button 
          onClick={toggleChatbot} 
          className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {!publicKey ? (
          <div className="flex items-center justify-center h-full">
            <ConnectWallet
              onSelectWallet={onSelectWallet}
              publicKey={publicKey}
              SWKKit={SWKKit}
            />
          </div>
        ) : (
          <ChatContainer
            handleSubmitAction={handleSubmitAction}
            publicKey={publicKey}
            SWKKit={SWKKit}
          />
        )}
      </div>
    </div>
  );
};

export default MiniChatBot;
