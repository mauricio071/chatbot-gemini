import { useEffect, useRef, useState } from "react";
import { ChatbotIcon } from "./components/ChatbotIcon";
import { ChatForm, ChatType } from "./components/ChatForm";
import { ChatMessage } from "./components/ChatMessage";
import { aiBaseData } from "./aiBaseData";

export const App = () => {
  const [chatHistory, setChatHistory] = useState<ChatType[]>([
    {
      hideInChat: true,
      role: "model",
      text: aiBaseData,
    },
  ]);
  const chatbodyRef = useRef<HTMLDivElement>(null);

  const generateBotResponse = async (history: ChatType[]) => {
    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    const chatBody = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatBody }),
    };

    try {
      const res = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error.message || "Algo de errado aconteceu");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      if (error instanceof Error) {
        updateHistory(error.message, true);
      }
    }
  };

  useEffect(() => {
    chatbodyRef.current?.scrollTo({
      top: chatbodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-outlined">
            keyboard_arrow_down
          </button>
        </div>

        <div ref={chatbodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">Hey there, how can i help you today?</p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};
