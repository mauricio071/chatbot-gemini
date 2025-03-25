import { ChatbotIcon } from "./ChatbotIcon";
import { ChatType } from "./ChatForm";

interface ChatMessageProps {
  chat: ChatType;
}

export const ChatMessage = ({ chat }: ChatMessageProps) => {
  return (
    !chat.hideInChat && (
      <div
        className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
          chat.isError ? "error" : ""
        }`}
      >
        {chat.role === "model" && <ChatbotIcon />}
        <p className="message-text">{chat.text}</p>
      </div>
    )
  );
};
