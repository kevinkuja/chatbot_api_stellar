import { SorobanRpc, TransactionBuilder } from "@stellar/stellar-sdk";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

export const TESTNET_DETAILS = {
  network: "TESTNET",
  networkUrl: "https://horizon-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
};

export interface NetworkDetails {
    network: string;
    networkUrl: string;
    networkPassphrase: string;
  }

  export const RPC_URLS: { [key: string]: string } = {
    TESTNET: "https://soroban-testnet.stellar.org/",
  };

  export const SendTxStatus: {
    [index: string]: SorobanRpc.Api.SendTransactionStatus;
  } = {
    Pending: "PENDING",
    Duplicate: "DUPLICATE",
    Retry: "TRY_AGAIN_LATER",
    Error: "ERROR",
  };
  

export const signTx = async (
    xdr: string,
    publicKey: string,
    kit: StellarWalletsKit,
  ) => {
    const { signedTxXdr } = await kit.signTransaction(xdr, {
      networkPassphrase: TESTNET_DETAILS.networkPassphrase,
      address: publicKey,
    });
    return signedTxXdr;
  };

  export const getServer = (networkDetails: NetworkDetails) =>
    new SorobanRpc.Server(RPC_URLS[networkDetails.network], {
      allowHttp: networkDetails.networkUrl.startsWith("http://"),
    });
  

    // Build and submits a transaction to the Soroban RPC
// Polls for non-pending state, returns result after status is updated
export const submitTx = async (
    signedXDR: string,
    networkPassphrase: string,
    server: SorobanRpc.Server,
  ) => {
    const tx = TransactionBuilder.fromXDR(signedXDR, networkPassphrase);
  
    const sendResponse = await server.sendTransaction(tx);
  
    if (sendResponse.errorResult) {
      throw new Error("UNABLE_TO_SUBMIT_TX");
    }

    return sendResponse.hash;
  
    // if (sendResponse.status === SendTxStatus.Pending) {
      // const txResponse = await server.getTransaction(sendResponse.hash);
      
  
      // // Poll this until the status is not "NOT_FOUND"
      // while (
      //   txResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
      // ) {
      //   // Wait two seconds
      //   // See if the transaction is complete
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      //   try {
      //     txResponse = await server.getTransaction(sendResponse.hash);
      //   } catch (error) {
      //     console.log("error getting transaction", error);
      //   }
      // }
  
      // if (txResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      //   return txResponse.resultXdr.toXDR("base64");
      // }
    // }
    // throw new Error(
    //   `Unabled to submit transaction, status: ${sendResponse.status}`,
    // );
  };

  export const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  