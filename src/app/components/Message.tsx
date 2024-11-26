"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useCopyToClipboard } from "../../lib/hooks/use-copy-to-clipboard";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { CodeBlock } from "./ui/CodeBlock";
import { parseCodeBlocks } from "../../lib/utils/helpers";
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
        // console.log(`person is signed in: ${user.fullName}`);
        name = user.firstName
    }
    // console.log(`agentId: ${agentId}`);
    // const [streamedText, setStreamedText] = useState<string>('');
    const currentUserName: string = name && name.length ? name : "AnonymousUser";
    const currentAgentName: string = agents && agents.length ? agents.filter((a: AgentProps) => a.assistant_id == agentId)[0]?.name : "";
    console.log('currentAgentName?', currentAgentName);

    const isUserMessage = msg?.role === "user";
    const messageClass = isUserMessage
        ? "bg-neutral-500/70 text-black font-normal "
        : "bg-default-background text-neutral-600 font-light";
    const alignmentClass = isUserMessage ? "justify-end" : "justify-start";

    const parsedContent = parseCodeBlocks(msg.content);

    return (
        <>

            {parsedContent.length > 0 ? <div className={`flex w-full mb-4 ${alignmentClass}`}>
                <div
                    className={` px-4 py-2 rounded-md overflow-x-auto ${messageClass} `}
                >
                    {parsedContent.map((part, index) => (
                        <React.Fragment key={index}>

                            {part.type === "text" ? (
                                <>
                                    <div className="flex flex-col sm:flex-row">
                                        <span className={`block ${isUserMessage
                                            ? 'text-brand-50' : 'text-brand-primary'} text-sm pr-2  sm:text-lg`}>
                                            {msg.role === "user"
                                                ? currentUserName
                                                : currentAgentName
                                            }:
                                        </span>
                                        <div className="block text-sm flex-1 sm:text-lg">
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                                {part.content.replace(/\n/gi, "&nbsp; \n").trim()}
                                            </ReactMarkdown>
                                        </div>
                                        <button
                                            className={`text-md p-2 scale-150 ${isUserMessage ? 'text-black' : 'text-neutral-600'} self-end hover:scale-1.1 focus:outline-none hover:text-brand-400`}
                                            onClick={() => copyToClipboard(msg.content)}
                                        >
                                            {isCopied ? "Copied!" : <ClipboardIcon />}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                part.language && <CodeBlock
                                    language={part.language}
                                    value={part.content}
                                />
                            )

                            }
                        </React.Fragment>
                    ))}
                </div>
            </div> : null}
        </>
    );
};

