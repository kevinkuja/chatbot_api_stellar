"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Message } from "./chat-container";
import { getServer, signTx, submitTx, TESTNET_DETAILS } from "@/utils/stellar";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { ExternalLink } from "lucide-react";

interface TransactionMessageProps {
  message: Message;
  pubKey: string | null;
  kit: StellarWalletsKit;
}

export default function TransactionMessage({
  message,
  pubKey,
  kit,
}: TransactionMessageProps) {
  const [txResultHash, setTxResulHash] = useState<string>("");

  const handleSendTransaction = async (
    transaction: NonNullable<Message["transactions"]>[0],
  ) => {
    if (!pubKey) return;

    try {
      const signedXdr = await signTx(transaction.xdr, pubKey, kit);
      const server = getServer(TESTNET_DETAILS);

      const hash = await submitTx(
        signedXdr,
        TESTNET_DETAILS.networkPassphrase,
        server,
      );
      setTxResulHash(hash);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("User rejected the request")
      ) {
        setTxResulHash("");
        return;
      }
      setTxResulHash("");
      console.error("Transaction error:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex",
        message.role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] overflow-hidden rounded-lg border border-border",
          message.role === "user" ? "bg-primary/5" : "bg-background",
        )}
      >
        {/* Message content */}
        <div className="p-4 border-b border-border">
          {message.transactionsContext?.message}
        </div>

        <Card className="border-0 shadow-none">
          {/* Network information */}
          <CardHeader className="p-0">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium flex items-center justify-between">
              <div className="px-2 py-1 bg-white/20 rounded-full text-xs">
                Transaction Request
              </div>
            </div>
          </CardHeader>
          {message.transactions?.map((transaction, index) => (
            <div key={index}>
              {/* Transaction details */}
              <CardContent className="p-4 space-x-4 flex">
                {/* Operation */}
                <div className="rounded-lg bg-purple-50 p-3 border border-purple-100 w-1/2">
                  <div className="text-xs font-medium text-purple-700 mb-1">
                    Operation {index + 1}
                  </div>
                </div>
              </CardContent>

              {/* Action buttons */}
              <CardFooter className="p-4 pt-0">
                {!txResultHash ? (
                  <Button
                    onClick={() => handleSendTransaction(transaction)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Send Transaction
                  </Button>
                ) : (
                  <div className="signed-xdr">
                    <p className="detail-header">See transaction on explorer</p>
                    <Card>
                      <CardContent>
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${txResultHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on Blockchain Explorer
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* {isHash(txStatusOrHash) && (
                  <div className="w-full space-y-2">
                    <div className="bg-green-100 text-green-800 p-2 rounded-md text-sm flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      Transaction sent successfully!
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-green-500 text-green-700 hover:bg-green-50"
                      onClick={() => openExplorer(txStatusOrHash)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Blockchain Explorer
                    </Button>
                  </div>
                )} */}

                {/* {txStatusOrHash === "error" && (
                  <div className="space-y-2 w-full">
                    <div className="bg-red-100 text-red-800 p-2 rounded-md text-sm">
                      <div className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Transaction failed
                      </div>
                      {errorMessage && (
                        <p className="mt-1 text-xs pl-6">{errorMessage}</p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleSendTransaction(transaction)}
                    >
                      Retry Transaction
                    </Button>
                  </div>
                )} */}
              </CardFooter>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
