"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Message } from "./Message";
import { useEnterSubmit } from "../../lib/hooks/use-enter-submit";
import { useScrollAnchor } from "../../lib/hooks/use-scroll-anchor";
import { useChat, MessageProps } from "@/contexts/ChatContext";

export const ChatWindow: React.FC = () => {
	const [inputValue, setInputValue] = useState("");
	const chatWindowRef = useRef<HTMLDivElement>(null);
	const {
		agentId,
		modelId,
		conversations,
		currentConversationId,
		sendChat,
		isLoading,
	} = useChat();
	const currentConversation = conversations[currentConversationId]
		? [...conversations[currentConversationId]]
		: [];

	const sortedMessages = useMemo(() => {
		console.log(
			"Conversation received from chat context",
			currentConversation
		);
		return [...currentConversation].sort((a, b) => {
			return (
				new Date(a.timestamp).getTime() -
				new Date(b.timestamp).getTime()
			);
		});
	}, [currentConversation]);

	const onSendMessage = async (message: string) => {
		console.log(`sending message to ${agentId}... message: ${message}`);
		await sendChat(message, modelId, agentId, 2000, 0.3);
	};

	const handleSendMessage = () => {
		if (inputValue.trim()) {
			const newMessage = { role: "user", content: inputValue.trim() };
			onSendMessage(newMessage.content);
			setInputValue("");
		}
	};

	const { inputRef, onKeyDown } = useEnterSubmit(handleSendMessage);

	return (
		<div className="container mx-auto px-4 py-4 h-full bg-mint rounded-lg shadow-2xl sm:w-3/4 lg:w-2/3 lg:h-4/5">
			<div className="w-full mx-auto h-full">
				<div className="flex flex-col h-full min-h-[400px] flex-grow">
					<div
						ref={chatWindowRef}
						className="flex-grow overflow-y-auto p-4"
					>
						{sortedMessages.map((message) => (
							<Message
								key={message.id}
								role={message.sender}
								content={message.text}
								agentId={message.agentId}
							/>
						))}
					</div>
					<div className="flex flex-col mb-4 items-stretch justify-items-stretch  bg-gray-100 sm:w-full sm:flex-row">
						<textarea
							ref={inputRef}
							className="flex-grow p-2 border border-gray-300 rounded-lg max-h-[420px] shadow-m bg-white text-black border-slate-300 py-2 pl-9 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm resize-none hover:resize-y sm:w-full"
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
			</div>
		</div>
	);
};
