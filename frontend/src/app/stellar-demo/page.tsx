// "use client";

import { handleSubmitAction } from "../page";
import { MiniChatBot } from "./mini-chat-bot";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <iframe
        src="/Stellar.html"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
      <MiniChatBot handleSubmitAction={handleSubmitAction} />
    </div>
  );
}
