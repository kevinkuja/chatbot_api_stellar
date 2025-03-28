import {
  Address,
  Contract,
  Memo,
  MemoType,
  nativeToScVal,
  Operation,
  scValToNative,
  TimeoutInfinite,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import { StellarTransaction, TransactionResult } from '../types/index.js';
import {
  accountToScVal,
  getServer,
  getTxBuilder,
  numberToI128,
  BASE_FEE,
} from './stellar/soroban.js';
import { xlmToStroop } from './stellar/format.js';
import { TESTNET_DETAILS } from './stellar/network.js';
import { getTokenAddress } from '../config/tokens.js';

export const generateTxs = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction[]> => {
  const txs: StellarTransaction[] = [];
  switch (result.action) {
    case 'transfer':
      txs.push(await generateTransferTx(caller, result));
      break;
    case 'invest':
    //txs.push(...(await generateInvestTx(caller, result)));
    //break;
    case 'swap':
    //txs.push(...(await generateSwapTx(caller, result)));
    //break;
    default:
      return Promise.resolve([]);
  }
  return txs;
};

const generateTransferTx = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction> => {
  switch (result.chain) {
    default:
      return generateStellarTransferTx(caller, result);
  }
};

const generateStellarTransferTx = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction> => {
  const tokenId = getTokenAddress(result.token);
  const contract = new Contract(tokenId);
  const server = getServer(TESTNET_DETAILS);
  const txBuilderAdmin = await getTxBuilder(
    caller,
    xlmToStroop(BASE_FEE).toString(),
    server,
    TESTNET_DETAILS.networkPassphrase
  );
  const tx = txBuilderAdmin
    .addOperation(
      contract.call(
        'transfer',
        ...[
          accountToScVal(caller), // from
          accountToScVal(result.to), // to
          numberToI128(result.amount), // quantity
        ]
      )
    )
    .setTimeout(TimeoutInfinite);

  if (result.memo && result.memo.length > 0) {
    tx.addMemo(Memo.text(result.memo));
  }
  const preparedTransaction = await server.prepareTransaction(tx.build());
  return preparedTransaction.toXDR();
};
