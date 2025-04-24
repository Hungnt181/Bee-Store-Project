/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

declare global {
  interface Window {
    CozeWebSDK: any;
  }
}

const Chatbot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.5/libs/oversea/index.js";
    script.async = true;
    script.onload = () => {
      if (window.CozeWebSDK) {
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: "7486025748881686546",
          },
          componentProps: {
            title: "Trợ lý ảo Bee-Store",
          },
          logger: console, // 👈 thử truyền tạm logger là console
          auth: {
            type: "token",
            token: import.meta.env.VITE_TOKEN_CHATBOT,
            onRefreshToken: function (): string {
              return "pat_5VRMaKd39LNaBpjxmnPSzXbjVeM4bngdnN8cLuahTAAODS28jyRqzehoUuxjBQSh";
            },
          },
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return null;
};

export default Chatbot;
