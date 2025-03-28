import { Request, Response } from 'express';
import { process } from '../helpers/openaiHelper.js';
import { generateTxs } from '../helpers/actions.js';

export const decodeHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { texts, caller } = req.body;

    console.log(texts, caller);

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        status: 'error',
        message: "Request body must include 'texts' as an array of strings",
      });
    }

    const result = await process(texts);
    console.log(result);
    const txs = await generateTxs(caller, result);
    console.log(txs);
    return res.json({
      status: 'success',
      data: {
        parsed: result,
        transactions: txs,
        chain: 'STELLAR',
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
