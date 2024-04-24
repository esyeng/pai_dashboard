"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message } from "./Message";
import { useEnterSubmit } from "../../lib/hooks/use-enter-submit";
import { useScrollAnchor } from "../../lib/hooks/use-scroll-anchor";

interface ChatWindowProps {
  agentId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ agentId }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  //   useScrollAnchor(chatWindowRef, messages);

  useEffect(() => {
    // Fetch chat history for the selected agent
    // and update the messages state
    // (Assuming you have an API endpoint for fetching chat history)
    // fetchChatHistory(agentId).then((history) => setMessages(history));
  }, [agentId]);

  const onSendMessage = (message: string) => {
    alert(message);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = { role: "user", content: inputValue.trim() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      onSendMessage(newMessage.content);
      setInputValue("");
    }
  };

  const { inputRef, onKeyDown } = useEnterSubmit(handleSendMessage);

  return (
    <div className="flex flex-col h-full min-h-[400px] flex-grow">
      <div ref={chatWindowRef} className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
      </div>
      <div className="flex flex-col mb-4 items-stretch justify-items-stretch  bg-gray-100 sm:w-full sm:flex-row">
        <textarea
          ref={inputRef}
          className="flex-grow p-2 border border-gray-300 rounded-lg max-h-[420px] shadow-m bg-white text-light-coral border-slate-300 py-2 pl-9 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm resize-none hover:resize-y sm:w-full"
          placeholder="Type your message..."
          value={inputValue}
          onKeyDown={onKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <button
        className="transition ease-in-out px-4 py-2 bg-light-coral text-white rounded hover:bg-chocolate-cosmos duration-300"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};
