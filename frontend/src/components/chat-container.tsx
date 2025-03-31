"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "@/components/chat-message";
import TransactionMessage from "@/components/transaction-message";
import { ApiResponse } from "@/app/page";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type: "text" | "transaction";
  transactions?: {
    xdr: string;
    // symbol: string;
    // functionName: "transfer" | "deposit" | "approve" | "swap";
    // functionData: unknown;
  }[];
  transactionsContext?: {
    message: string;
    description: string;
    // chainName: string;
    // chainId: number;
  };
}

export default function ChatContainer({
  handleSubmitAction,
  publicKey,
  SWKKit,
}: {
  handleSubmitAction: (texts: string[], caller: string) => Promise<ApiResponse>;
  publicKey: string | null;
  SWKKit: StellarWalletsKit;
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Olivia. How can I help you with blockchain interactions today?",
      type: "text",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const caller = publicKey;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    if (!input.trim()) return;

    if (!caller) {
      console.error("No caller found");
      setIsLoading(false);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      type: "text",
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    try {
      const texts = updatedMessages.map((message) => message.content);
      const result = await handleSubmitAction(texts, caller);

      if (result.status !== "success" || !result.data) {
        throw new Error("Failed to submit message");
      }

      const { parsed, transactions } = result.data;
      // const symbols: Record<Address, string> = {};
      // const publicClient = getPublicClient(config, {
      //   chainId: result.data.chain,
      // });
      // TODO: Get symbols

      // transactions.forEach(async (transaction) => {
      //   if (transaction?.to.toLowerCase() === PROTOCOL_ADDRESS.toLowerCase()) {
      //     symbols[transaction.to] = "ETH";
      //   } else if (transaction?.to && publicClient) {
      //     // TOKEN SYMBOL
      //     const erc20TokenContractInstance = getContract({
      //       address: transaction?.to as Address,
      //       abi: erc20Abi,
      //       client: publicClient,
      //     });

      //     try {
      //       symbols[transaction.to] =
      //         await erc20TokenContractInstance.read.symbol();
      //     } catch (error) {
      //       console.error("Error fetching token symbol:", error);
      //     }
      //   }
      //   console.log("TRANSACTION:", transaction);
      // });

      // console.log("symbols", symbols);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: parsed.message,
        type: transactions.length > 0 ? "transaction" : "text",
        transactions: transactions.map((transaction) => ({
          xdr: transaction,
          message: parsed.message,
          amount: parsed.amount,
          // symbol: symbols[transaction.to],
          // functionName: transaction.functionName,
          // functionData: transaction.functionData,
        })),
        transactionsContext: {
          // chainId: Number(result.data?.chain ?? 1),
          // chainName: parsed.chain,
          message: parsed.message,
          description: parsed.description,
        },
      };

      const lastUpdatedMessages = [...updatedMessages, assistantMessage];

      setMessages(lastUpdatedMessages);

      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting message:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto pt-8">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) =>
          message.type === "text" ? (
            <ChatMessage message={message} key={message.id} />
          ) : (
            <TransactionMessage
              message={message}
              key={message.id}
              pubKey={publicKey}
              kit={SWKKit}
            />
          ),
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Olivia..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
