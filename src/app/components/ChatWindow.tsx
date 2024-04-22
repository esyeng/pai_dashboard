'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { useEnterSubmit } from '../../lib/hooks/use-enter-submit';
import { useScrollAnchor } from '../../lib/hooks/use-scroll-anchor';

interface ChatWindowProps {
  agentId: string;
  onSendMessage: (message: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ agentId, onSendMessage }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

//   useEnterSubmit(inputRef, handleSendMessage);
//   useScrollAnchor(chatWindowRef, messages);

  useEffect(() => {
    // Fetch chat history for the selected agent
    // and update the messages state
    // (Assuming you have an API endpoint for fetching chat history)
    // fetchChatHistory(agentId).then((history) => setMessages(history));
  }, [agentId]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = { role: 'user', content: inputValue.trim() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      onSendMessage(newMessage.content);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={chatWindowRef} className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
      </div>
      <div className="flex items-center p-4 bg-gray-100">
        <textarea
          ref={inputRef}
          className="flex-grow p-2 border border-gray-300 rounded mr-2 bg-white text-light-coral w-full border-slate-300 py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm resize-sm"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};
