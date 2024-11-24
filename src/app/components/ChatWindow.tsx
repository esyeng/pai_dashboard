// ChatWindow.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo, use } from "react";
import { Message } from "./Message";
import MessageLoadingIndicator from "./ui/MessageLoadingIndicator";
import { useEnterSubmit } from "../../lib/hooks/use-enter-submit";
import { useChat } from "@/contexts/ChatContext";

export const ChatWindow: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const {
        agentId,
        modelId,
        shouldQueryResearchModel,
        threadState: { threads, currentThreadId, messagesInActiveThread },
        user,
        sendChat,
        isLoading,
        selectedActions,
        disableQuery
    } = useChat();

    const currentConversation = useMemo(() => {
        return currentThreadId && threads[currentThreadId]?.messages
            ? threads[currentThreadId].messages
            : [];
    }, [threads, currentThreadId]);

    const onSendMessage = async (message: string) => {
        console.log(
            `sending message to ${agentId}... message: ${message} in thread ${currentThreadId}`
        );

        await sendChat(
            message,
            modelId,
            agentId,
            currentThreadId || "",
            shouldQueryResearchModel,
            null,
            null,
            user?.firstName
        );
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim());
            setInputValue("");
        }
    };

    const agentNameFormatted = agentId.split(/[ +_+]/).map(word => (
        word.length > 1
            ? word.split("")[0].toUpperCase() + word.slice(1, word.length)
            : word.toUpperCase())
    ).join(' ')

    const { onKeyDown } = useEnterSubmit(handleSendMessage);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [currentConversation.length]);

    return (
        <div className="container mx-auto px-4 py-4 h-full bg-gradient-to-b from-[#4ce6ab2d] to-[#0ea46a3b] rounded-lg shadow-xl">
            <div className="w-full mx-auto h-full">
                <div className="flex flex-col h-full min-h-[400px] max-h-[800px] flex-grow">
                    <div className="flex-grow overflow-y-auto p-4">
                        {currentConversation.map(
                            (message: MessageProps | string, i: number) => {
                                let msg;
                                if (typeof message === "string") {
                                    msg = JSON.parse(message);
                                } else {
                                    msg = message;
                                    console.log("message.msg", message.msg);
                                }
                                return (

                                    // <div key={msg.id || i}>no

                                    <Message
                                        key={msg.id || i}
                                        id={msg.id}
                                        msg={msg.msg}
                                        timestamp={msg.timestamp}
                                        sender={msg.sender}
                                        agentId={msg.agentId}
                                    />
                                    // </div>

                                );
                            }
                        )}
                        {isLoading && (
                            <div className="h-12">
                                <div className="flex items-center justify-start bg-gray-200 rounded-lg p-4">
                                    <MessageLoadingIndicator />
                                    {/* <svg */}
                                    {/* //             className="w-5 h-5 text-gray-600 animate-spin"
                            //             xmlns="http://www.w3.org/2000/svg"
                            //             fill="none"
                            //             viewBox="0 0 24 24"
                            //         > */}
                                    {/* //             <circle
                            //                 className="opacity-25"
                            //                 cx="12"
                            //                 cy="12"
                            //                 r="10"
                            //                 stroke="currentColor"
                            //                 strokeWidth="4"
                            //             ></circle>
                            //             <path
                            //                 className="opacity-75"
                            //                 fill="currentColor"
                            //                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            //             ></path>
                            //         </svg>
                            //  */}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col mb-4 items-stretch justify-items-stretch sm:w-full sm:flex-row">
                        <textarea
                            ref={inputRef}
                            className="flex-grow p-2 border border-mint rounded-xl max-h-[420px] shadow-m bg-[#fff1c000] text-[#85d7de] border-slate-300 py-2 pl-9 pr-3 placeholder:text-[#85d7de] transition ease-in-out hover:bg-mint/20 focus:bg-mint/20 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#5bdde8] duration-200 sm:text-sm resize-none hover:resize-y sm:w-full"
                            placeholder={
                                shouldQueryResearchModel
                                    ? `Conduct research with ${agentNameFormatted}`
                                    : `Send a message to ${agentNameFormatted}...`
                            }
                            value={inputValue}
                            onKeyDown={onKeyDown}
                            onChange={e => setInputValue(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        className="transition ease-in-out px-4 py-2 border-2 border-mint bg-[#151515] text-[#fff] rounded hover:bg-mint hover:border-transparent hover:text-caribbean-current duration-300 disabled:opacity-75 disabled:hover:bg-[#151515] disabled:hover:text-[#fff] disabled:cursor-not-allowed"
                        onClick={handleSendMessage}
                        disabled={disableQuery}
                    >
                        {shouldQueryResearchModel ? "Search" : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// {testData && (
//     <div className="p-4 flex items-center justify-center">
//         <h1 className="flex gap-2 p-8 w-full text-[#9de6ca] text-xl rounded">
//             test data!: {JSON.stringify(testData)}
//         </h1>
//     </div>
// )}

// <button onClick={handleTestSearch}>TextResearchResponse</button>
// const handleTestSearch = async () => {
//     const testObj = {
//         "user_id": "user_2fcYxEZjvkR9JSYcPCWFArsVy4p",
//         "question": "What are some fall women's fashion trends to look out for in NYC this fall?", "date": "November 2024",
//         "max_turns": 2,
//         "actions_to_include": ["wikipedia", "google"],
//         "additional_instructions": "Search either wikipedia or google to find information relevant to the question",
//         "model": "claude-3-5-sonnet-20241022",
//         "example": "",
//         "character": ""
//     }
//     console.log("await token");
//     if (token) {
//         console.log("token!")
//         let res = await queryResearchModel(testObj, token);
//         console.log("res", res);
//         if (res) {
//             setTestData(res);
//         }
//     }

// }
