"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Message } from "./Message";
import { useEnterSubmit } from "../../lib/hooks/use-enter-submit";
import { useChat } from "@/contexts/ChatContext";
import { MessageProps } from "@/lib/types";
import { agents, models } from "@/lib/store";
import { useAuth, useUser } from "@clerk/nextjs";

export const ChatWindow: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { userId, isLoaded } = useAuth();
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const {
        agentId,
        modelId,
        threads,
        user,
        currentThreadId,
        sendChat,
        isLoading,
    } = useChat();
    const currentConversation = useMemo(() => {
        console.log(`currentThreadId: ${currentThreadId}`)
        console.log(`current thread: ${JSON.stringify(threads[currentThreadId])}`);

        return threads[currentThreadId] ? threads[currentThreadId]["messages"] :
            [
                {
                    id: "1",
                    sender: "user",
                    agentId: "jasmyn",
                    timestamp: new Date().getTime(),
                    msg:
                    {
                        role: "user",
                        content: "Hello, I'm here to chat with you!"
                    }
                }
            ];
    }, [threads, currentThreadId]);
    console.log(`currentConversation: ${JSON.stringify(currentConversation)}`);

    const sortedConversation = useMemo(() => {
        return [...currentConversation].sort(
            (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
        );
    }, [currentConversation]);

    const onSendMessage = async (message: string) => {
        console.log(`sending message to ${agentId}... message: ${message}`);
        await sendChat(message, modelId, agentId, user ? user.firstName : 'anonymousUser', 2000, 0.3);
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const newMessage = { role: "user", content: inputValue.trim() };
            onSendMessage(newMessage.content);
            setInputValue("");
        }
    };

    const { onKeyDown } = useEnterSubmit(handleSendMessage);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [sortedConversation?.length]);

    return (
        <div className="container mx-auto px-4 py-4 h-full bg-gradient-to-b from-[#4ce6ab2d] to-[#0ea46a3b] rounded-lg shadow-xl sm:w-3/4 lg:w-2/3 lg:h-4/5">
            <div className="w-full mx-auto h-full">
                <div className="flex flex-col h-full min-h-[400px] flex-grow">
                    <div className="flex-grow overflow-y-auto p-4">
                        {sortedConversation.map((message) => (
                            <Message
                                key={message.id}
                                id={message.id}
                                msg={{ role: message.msg.role, content: message.msg.content }}
                                timestamp={message.timestamp}
                                sender={message.sender}
                                agentId={message.agentId}
                            />
                        ))}
                        {isLoading ? (
                            <div className="h-12">
                                <div className="flex items-center justify-center bg-gray-200 rounded-lg p-4">
                                    <svg
                                        className="w-5 h-5 text-gray-600 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex flex-col mb-4 items-stretch justify-items-stretch sm:w-full sm:flex-row">
                        <textarea
                            ref={inputRef}
                            className="flex-grow p-2 border border-mint rounded-xl max-h-[420px] shadow-m bg-[#fff1c000] text-[#85d7de] border-slate-300 py-2 pl-9 pr-3 placeholder:text-[#85d7de] transition ease-in-out hover:bg-mint/20 focus:bg-mint/20 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#5bdde8] duration-200 sm:text-sm resize-none hover:resize-y sm:w-full"
                            placeholder="Type your message..."
                            value={inputValue}
                            onKeyDown={onKeyDown}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        className="transition ease-in-out px-4 py-2 bg-tea-green/25 text-caribbean-current rounded hover:bg-tea-green/60 duration-300"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
