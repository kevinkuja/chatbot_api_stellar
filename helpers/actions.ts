import {
  Contract,
  Memo,
  Networks,
  StrKey,
  TimeoutInfinite,
  xdr,
  Address,
  XdrLargeInt,
  TransactionBuilder,
  Asset,
  rpc,
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
import {
  MAINNET_DETAILS,
  SOROBAN_MAINNET_DETAILS,
  SOROBAN_TESTNET_DETAILS,
  TESTNET_DETAILS,
} from './stellar/network.js';
import { getTokenDetails, TokenDetails } from '../config/tokens.js';
import fetch from 'node-fetch';

const YIELDBLOX_CONTRACT_ADDRESS = 'CBP7NO6F7FRDHSOFQBT2L2UWYIZ2PU76JKVRYAQTG3KZSQLYAOKIF2WB';
const routerContractId = 'CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK';

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
  const server = new rpc.Server(SOROBAN_TESTNET_DETAILS.networkUrl);
  const sendToken = getTokenDetails(result.token, 'testnet');
  const destToken = getTokenDetails(result.dest_token || '', 'testnet');

  if (!sendToken || !destToken) {
    throw new Error(`Token ${!sendToken ? result.token : result.dest_token} not found in TOKENS`);
  }

  const estimateResult = await findSwapPath(sendToken, destToken, result.amount);
  // No need to generate swapsChain manually, use value received from find-path api
  const swapsChain = xdr.ScVal.fromXDR(estimateResult.swap_chain_xdr, 'base64');
  const tokenInScVal = Address.contract(StrKey.decodeContract(sendToken.contract)).toScVal();
  const amountU128 = new XdrLargeInt('u128', result.amount.toFixed()).toU128();
  const amountWithSlippage = estimateResult.amount * 0.99; // slippage 1%
  const amountWithSlippageU128 = new XdrLargeInt('u128', amountWithSlippage.toFixed()).toU128();

  const account = await server.getAccount(caller);
  try {
    const contract = new Contract(routerContractId);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.PUBLIC,
    })
      .addOperation(
        contract.call(
          'swap_chained',
          xdr.ScVal.scvAddress(Address.fromString(caller).toScAddress()),
          swapsChain,
          tokenInScVal,
          amountU128,
          amountWithSlippageU128
        )
      )
      .setTimeout(TimeoutInfinite)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    return preparedTx.toXDR();
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

const baseApi = 'https://amm-api.aqua.network/api/external/v1'; // 'https://amm-api-testnet.aqua.network/api/external/v1';
const baseApiTestnet = 'https://amm-api-testnet.aqua.network/api/external/v1';
async function findSwapPath(tokenFrom: TokenDetails, tokenTo: TokenDetails, amount: number) {
  const headers = { 'Content-Type': 'application/json' };
  const tokenIn =
    tokenFrom.code == 'XLM' ? Asset.native() : new Asset(tokenFrom.code, tokenFrom.contract);
  const tokenOut =
    tokenTo.code == 'XLM' ? Asset.native() : new Asset(tokenTo.code, tokenTo.contract);

  const body = JSON.stringify({
    token_in_address: tokenIn.contractId(SOROBAN_TESTNET_DETAILS.networkPassphrase),
    token_out_address: tokenOut.contractId(SOROBAN_TESTNET_DETAILS.networkPassphrase),
    amount: amount.toString(),
  });

  const estimateResponse = await fetch(`${baseApiTestnet}/find-path/`, {
    method: 'POST',
    body,
    headers,
  });
  const estimateResult: any = await estimateResponse.json();

  console.log(estimateResult);

  if (!estimateResult.success) {
    throw new Error('Estimate failed');
  }

  return estimateResult;
}
