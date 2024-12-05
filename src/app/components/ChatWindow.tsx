// ChatWindow.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo, use } from "react";
import { Message } from "./Message";
import MessageLoadingIndicator from "./ui/MessageLoadingIndicator";
import { useEnterSubmit } from "../../lib/hooks/use-enter-submit";
import { useChat } from "@/contexts/ChatContext";
import { useAssistants } from "@/contexts/AssistantContext";
import { useJasmynAuth } from "@/contexts/AuthContext";

export const ChatWindow: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const {
        shouldQueryResearchModel,
        threadState: { threads, currentThreadId, messagesInActiveThread },
        sendChat,
        isLoading,
        selectedActions,
        disableQuery
    } = useChat();
    const { agentId, modelId } = useAssistants();
    const { user } = useJasmynAuth();

    const currentConversation = useMemo(() => {
        return currentThreadId && threads[currentThreadId]?.messages
            ? threads[currentThreadId].messages
            : [];
    }, [threads, currentThreadId]);

    const onSendMessage = async (message: string) => {
        console.log(
            `sending message to ${agentId}... message: ${message} in thread ${currentThreadId}`
        );
        console.log("user from about to send message block in chat window", user);

        await sendChat(
            message,
            modelId,
            agentId,
            currentThreadId || "",
            shouldQueryResearchModel,
            null,
            null,
            user?.user.firstName
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
        <div className=" px-4 py-4 mx-2 sm:mx-0 h-full bg-brand-50/70 rounded-md">
            <div className="">
                <div className="">
                    <div className=" overflow-y-auto max-h-[32rem] sm:p-4">
                        {currentConversation.map(
                            (message: MessageProps | string, i: number) => {
                                let msg;
                                console.log("message type before replace?", typeof message);
                                if (typeof message === "string") {
                                    // console.log("message raw string", message);
                                    msg = JSON.parse(message);
                                    msg.msg.content.replace(/([\\n])+/g, "&nbsp; \n");
                                    // console.log("msg content after replace", msg.msg.content)

                                    // console.log("msg after replace", msg);
                                } else {
                                    msg = message;
                                    msg.msg.content.replace(/([\\n])+/g, `&nbsp; \n`);
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
                                <div className="">
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
                            className="flex-grow p-2 mr-2 mb-2 border border-brand-primary rounded-xl max-h-[420px] text-neutral-700 bg-default-background min-h-20 py-2 pr-3 placeholder:text-d transition ease-in-out hover:bg-neutral-100/20 focus:bg-neutral-100/40 focus:border-black duration-200 sm:text-sm resize-y sm:w-full"
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
                    <div className=" flex items-center justify-center w-full"></div>
                    <button
                        className="mr-4 mb-8 w-full transition ease-in-out px-4 py-2 bg-brand-200 text-neutral-600 rounded hover:bg-brand-500/50 hover:border-transparent duration-300 disabled:opacity-75 disabled:hover:bg-[#151515] disabled:hover:text-[#fff] disabled:cursor-not-allowed sm:max-w-64"
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
