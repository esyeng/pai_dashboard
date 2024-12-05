// ChatWindow.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Message } from "./Message";
// import { StreamingMessage } from "./StreamingMessage"
import MessageLoadingIndicator from "./ui/MessageLoadingIndicator";
import { useEnterSubmit } from "../../lib/hooks/use-enter-submit";
import { useChat } from "@/contexts/ChatContext";
import { useAssistants } from "@/contexts/AssistantContext";
import { useJasmynAuth } from "@/contexts/AuthContext";
import { debounce } from "lodash";

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

    const parseMessage = (message: MessageProps | string) => {
        let msg
        if (typeof message === "string") {
            // console.log("message raw string", message);
            msg = JSON.parse(message);
            msg.msg.content.replace(/([\\n])+/g, "&nbsp; \n");

        } else {
            msg = message;
            msg.msg.content.replace(/([\\n])+/g, `&nbsp; \n`);
            // console.log("message.msg", message.msg);
        }
        return msg as MessageProps;
    }

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

    // const debouncedSetInputValue = useMemo(() => debounce(setInputValue, 100), []);

    const agentNameFormatted = agentId.split(/[ +_+]/).map(word => (
        word.length > 1
            ? word.split("")[0].toUpperCase() + word.slice(1, word.length)
            : word.toUpperCase())
    ).join(' ')

    const { onKeyDown } = useEnterSubmit(handleSendMessage);

    const scrollToBottom = useCallback((node: any) => {
        node?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, []);

    // useEffect(() => {
    //     if (chatWindowRef.current) {
    //         chatWindowRef.current.scrollIntoView({
    //             behavior: "smooth",
    //             block: "end",
    //         });
    //     }
    // }, [currentConversation.length]);

    return (
        <div className=" px-4 py-4 mx-2 sm:mx-0 h-full bg-brand-50/70 rounded-md" ref={scrollToBottom}>
            <div className="">
                <div className="">
                    <div className=" overflow-y-auto max-h-[32rem] sm:p-4">
                        {currentConversation.map(
                            (message: MessageProps, i: number) => {
                                let msg = parseMessage(message);
                                // console.log("message type before replace?", typeof message);

                                return (
                                    <Message
                                        key={msg.id || i}
                                        id={msg.id}
                                        msg={msg.msg}
                                        timestamp={msg.timestamp}
                                        sender={msg.sender}
                                        agentId={msg.agentId}
                                    />
                                );
                            }
                        )}
                        {isLoading && (
                            <div className="h-12">
                                <div className="">
                                    <MessageLoadingIndicator />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col mx-2 my-4 items-stretch justify-items-stretch sm:w-full sm:flex-row">
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
                    <div className=" flex items-center justify-center w-full">

                        <button
                            className="mx-4 mb-8 w-full transition ease-in-out px-4 py-2 bg-brand-200 text-neutral-600 rounded hover:bg-brand-500/50 hover:border-transparent duration-300 disabled:opacity-75 disabled:hover:bg-[#151515] disabled:hover:text-[#fff] disabled:cursor-not-allowed"
                            onClick={handleSendMessage}
                            disabled={disableQuery}
                        >
                            {shouldQueryResearchModel ? "Search" : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
