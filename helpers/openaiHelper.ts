import openai from '../config/openai.js';
import { TransactionResult } from '../types';

export const processTextsWithAI = async (texts: string[]): Promise<TransactionResult> => {
  if (!texts || !Array.isArray(texts)) {
    throw new Error('Texts must be provided as an array of strings');
  }

  const prompt = `
Interpret the following text and extract the following fields in JSON format based on the specified action. Return only the JSON object, nothing else (no additional text, comments, or markdown).

Fields to extract for all actions:
- "action": Should be similar to (another language, synonyms, etc) ["transfer", "swap", "invest"].
- "amount": The numeric value involved (e.g., amount to transfer, swap, or sell). If not found, set to null and include in "message".
- "token": The currency or token being used. If not found, set to null and include in "message".
- "chain": The blockchain, must be "stellar". If not specified, assume "stellar".

Action-specific fields:
- Only "transfer":
  - "to": The recipient address or destination (should start with 'G' and be 56 characters long). If not found or invalid, set to null and include in "message".
- Only "swap":
  - "dest_token": The token to receive. Must match a "code" or "name" from the token list. If not found, set to null and include in "message".
  - "dest_min": Minimum amount to receive. If not found, set to 0.
- Only "invest":
  - "platform": The platform to invest in. Must match a "code" or "name" from the platform list. If not found, assume it's "YieldBlox".

Additional fields:
- "description": A detailed description of the future transaction based on the extracted fields (e.g., "This transaction will transfer 10 XLM from the caller to GBZX... on Stellar").
- "message": A user-friendly message explaining the transaction or missing fields (e.g., "This will transfer 10 XLM to GBZX..., but the token was not specified").

Rules:
- If a field is missing or unclear, set it to null and explain it in the "message", but return the other fields as JSON.
- Use the current text to determine the action and fields. Previous texts are for context only and should not override the current text.
- Assume reasonable defaults where applicable (e.g., chain = "stellar" if not mentioned).

Current text: ${texts[texts.length - 1]}

Previous texts (for context only): ${texts.slice(0, -1).join('\n')}`;

  console.log(prompt);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    store: true,
    messages: [{ role: 'user', content: prompt }],
  });

  console.log(completion);
  const content = completion.choices[0].message.content;
  console.log(content);
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }
  return JSON.parse(cleanJson(content)) as TransactionResult;
};

const cleanJson = (json: string): string => {
  return json.startsWith('json') ? json.slice(4).trim() : json;
};

export const process = async (texts: string[], retries: number = 3): Promise<TransactionResult> => {
  const errors = [];
  for (let i = 0; i < retries; i++) {
    try {
      return await processTextsWithAI(texts);
    } catch (error) {
      console.error(`Error processing text: ${error}`);
      errors.push(error);
    }
  }
  throw new Error(`Failed to process text: ${errors.join(', ')}`);
};
