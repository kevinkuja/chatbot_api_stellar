import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPEN_AI_API_KEY) {
  throw new Error('OPEN_AI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export default openai;
