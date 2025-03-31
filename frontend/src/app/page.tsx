import Wrapper from "./wrapper";

interface BaseParsedResponse {
  description: string;
  message: string;
  chain: string;
}

interface ParsedResponse extends BaseParsedResponse {
  action: "transfer" | "invest" | "swap";
  amount: number;
  to: string;
  token: string;
}

export interface ApiResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    parsed: ParsedResponse;
    transactions: string[];
    chain: string;
  };
}

export const handleSubmitAction = async (
  texts: string[],
  caller: string
): Promise<ApiResponse> => {
  "use server";
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/decode`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts,
        caller,
      }),
    }
  );
  const data = await result.json();
  return data;
};
export default function Home() {
  return <Wrapper handleSubmitAction={handleSubmitAction} />;
}
