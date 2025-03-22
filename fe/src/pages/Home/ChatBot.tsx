import { useEffect } from "react";

declare global {
  interface Window {
    CozeWebSDK: {
      WebChatClient: new (config: {
        config: { bot_id: string };
        componentProps: {
          title: string;
          placeholder: string;
          sendButtonText: string;
        };
        auth: {
          type: string;
          token: string;
          onRefreshToken: () => string;
        };
      }) => void;
    };
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
            bot_id: "7483879418537263111",
          },
          componentProps: {
            title: "Trợ lý ảo Bee-Store",
            placeholder: "Nhập câu hỏi của bạn...",
            sendButtonText: "Gửi",
          },
          auth: {
            type: "token",
            token: "pat_********", // <- thay bằng token thật
            onRefreshToken: function () {
              return "pat_********"; // <- thay bằng token thật
            },
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default Chatbot;
