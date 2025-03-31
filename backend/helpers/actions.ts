import { Contract, Memo, TimeoutInfinite, xdr } from '@stellar/stellar-sdk';
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
import { getTokenDetails } from '../config/tokens.js';
import { VectorStoreFilesPage } from 'openai/resources/vector-stores/files.js';

const YIELDBLOX_CONTRACT_ADDRESS = 'CBP7NO6F7FRDHSOFQBT2L2UWYIZ2PU76JKVRYAQTG3KZSQLYAOKIF2WB';
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
      txs.push(await generateInvestTx(caller, result));
      break;
    case 'swap':
      txs.push(await generateSwapTx(caller, result));
      break;
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

const generateInvestTx = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction> => {
  switch (result.chain) {
    default:
      return generateStellarInvestTx(caller, result);
  }
};

const generateSwapTx = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction> => {
  switch (result.chain) {
    default:
      return generateStellarSwapTx(caller, result);
  }
};

const generateStellarTransferTx = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction> => {
  const tokenDetails = getTokenDetails(result.token);
  if (!tokenDetails) {
    throw new Error(`Token ${result.token} not found in TOKENS`);
  }
  const contract = new Contract(tokenDetails.contract);
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
          numberToI128(result.amount * 10 ** 7), // quantity
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

const generateStellarSwapTx = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction> => {
  const server = getServer(TESTNET_DETAILS);
  const txBuilder = await getTxBuilder(
    caller,
    xlmToStroop(BASE_FEE).toString(),
    server,
    TESTNET_DETAILS.networkPassphrase
  );
  const sendToken = getTokenDetails(result.token);
  const destToken = getTokenDetails(result.dest_token || '');
  if (!sendToken || !destToken) {
    throw new Error(`Token ${!sendToken ? result.token : result.dest_token} not found in TOKENS`);
  }
  try {
    const contract = new Contract(sendToken.contract);
    const tx = txBuilder
      .addOperation(
        contract.call(
          'swap',
          ...[
            accountToScVal(caller),
            accountToScVal(destToken.contract),
            numberToI128(result.amount || 0),
            numberToI128(result.dest_min || 0),
          ]
        )
      )
      .setTimeout(TimeoutInfinite);

    if (result.memo && result.memo.length > 0) {
      tx.addMemo(Memo.text(result.memo));
    }
    const preparedTransaction = await server.prepareTransaction(tx.build());
    return preparedTransaction.toXDR();
  } catch (error) {
    console.error(error);
    return '0xMOCK';
  }
};

const generateStellarInvestTx = async (
  caller: any,
  result: TransactionResult
): Promise<StellarTransaction> => {
  const server = getServer(TESTNET_DETAILS);
  const txBuilder = await getTxBuilder(
    caller,
    xlmToStroop(BASE_FEE).toString(),
    server,
    TESTNET_DETAILS.networkPassphrase
  );

  const tokenDetails = getTokenDetails(result.token);
  if (!tokenDetails) throw new Error(`Token ${result.token} not found in TOKENS`);
  try {
    const request: xdr.ScVal[] = [];
    request.push(
      xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol('asset'),
          val: accountToScVal(tokenDetails.contract),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol('amount'),
          val: numberToI128(result.amount),
        }),
      ])
    );

    const contract = new Contract(YIELDBLOX_CONTRACT_ADDRESS);
    const tx = txBuilder
      .addOperation(
        contract.call(
          'submit',
          accountToScVal(caller), // from
          accountToScVal(caller), // spender (caller)
          accountToScVal(YIELDBLOX_CONTRACT_ADDRESS), // to (pool)
          xdr.ScVal.scvVec(request)
        )
      )
      .setTimeout(TimeoutInfinite);

    if (result.memo && result.memo.length > 0) {
      tx.addMemo(Memo.text(result.memo));
    }
    const preparedTransaction = await server.prepareTransaction(tx.build());
    return preparedTransaction.toXDR();
  } catch (error) {
    console.error(error);
    return '0xMOCK';
  }
};
