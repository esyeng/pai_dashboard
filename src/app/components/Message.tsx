"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCopyToClipboard } from "../../lib/hooks/use-copy-to-clipboard";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { CodeBlock } from "./ui/CodeBlock";
import { parseCodeBlocks } from "../../lib/utils";
import { useUser } from "@clerk/nextjs";
import { useChat } from "../../contexts/ChatContext";


export const Message: React.FC<MessageProps> = ({
    id,
    timestamp,
    sender,
    msg,
    agentId,
}) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard({});
    const { user, isLoaded, isSignedIn } = useUser();
    const { agents } = useChat();
    let name: any = ''
    if (!isLoaded) {
        return null;
    }
    if (user && isSignedIn) {
        console.log(`person is signed in: ${user.fullName}`);
        name = user.firstName
    }
    console.log(`agentId: ${agentId}`);
    // const [streamedText, setStreamedText] = useState<string>('');
    const currentUserName: string = name && name.length ? name : "AnonymousUser";
    const currentAgentName: string = agents && agents.length ? agents.filter((a: AgentProps) => a.assistant_id == agentId)[0]?.name : "";
    // const currentAgentName: string = "Test";
    console.log('currentAgentName?', currentAgentName);
    console.log("msg in Message component", msg);

    const isUserMessage = msg?.role === "user";
    const messageClass = isUserMessage
        ? "bg-[#fafcff66] text-black font-normal border border-gray-200"
        : "bg-[#000000bd] text-white font-light";
    const alignmentClass = isUserMessage ? "justify-end" : "justify-start";
    const parsedContent = parseCodeBlocks(msg.content);

    return (
        <div className={`flex ${alignmentClass} mb-4`}>
            <div
                className={`px-4 py-2 rounded-lg overflow-x-auto ${messageClass} `}
                style={{ maxWidth: "80%" }}
            >
                {parsedContent.map((part, index) => (
                    <React.Fragment key={index}>
                        {part.type === "text" ? (
                            <>
                                <span className={`block ${isUserMessage
                                    ? 'text-caribbean-current' : 'text-light-coral'} text-2xl`}>
                                    {msg.role === "user"
                                        ? currentUserName
                                        : currentAgentName
                                    }
                                </span>
                                <div className="block text-lg">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {part.content}
                                    </ReactMarkdown>
                                </div>
                            </>
                        ) : (
                            <CodeBlock
                                language={part.language}
                                value={part.content}
                            />
                        )}
                    </React.Fragment>
                ))}
                <button
                    className={`text-xs text-chocolate-cosmos hover:scale-1.1 focus:outline-none`}
                    onClick={() => copyToClipboard(msg.content)}
                >
                    {isCopied ? "Copied!" : <ClipboardIcon />}
                </button>
            </div>
        </div>
    );
};

/**
 * ? "bg-vista-blue text-gray"
        : "bg-jasmine text-black";
 */
