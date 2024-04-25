"use client";

import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCopyToClipboard } from "../../lib/hooks/use-copy-to-clipboard";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { CodeBlock } from "./ui/CodeBlock";
import { parseCodeBlocks } from "../../lib/utils";

interface AgentDict {
    [key: string]: string;
}
const agents: AgentDict = {
    tutor: "AI Tutor",
    coder: "Coder",
    ada: "Ada",
    fed: "F.E.D.",
    jasmyn: "Jasmyn",
};

interface MessageProps {
    role: string;
    content: string;
    agentId: string;
    stream?: boolean;
    language?: string;
}
export const Message: React.FC<MessageProps> = ({
    role,
    content,
    agentId,
}) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard({});
    // const [streamedText, setStreamedText] = useState<string>('');
    const currentUserName: string = "Esmé";

    const isUserMessage = role === "user";
    const messageClass = isUserMessage
        ? "bg-vista-blue text-gray"
        : "bg-jasmine text-black";
    const alignmentClass = isUserMessage ? "justify-end" : "justify-start";
    const parsedContent = parseCodeBlocks(content);

    return (
        <div className={`flex ${alignmentClass} mb-4`}>
            <div
                className={`px-4 py-2 rounded-lg ${messageClass} shadow-md`}
                style={{ maxWidth: "80%" }}
            >
                {parsedContent.map((part, index) => (
                    <React.Fragment key={index}>
                        {part.type === "text" ? (
                            <>
                                <span className="block text-chocolate-cosmos text-md">
                                    {role === "user"
                                        ? currentUserName
                                        : agents[agentId]}
                                </span>
                                <div className="block text-xs">
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
                    onClick={() => copyToClipboard(content)}
                >
                    {isCopied ? "Copied!" : <ClipboardIcon />}
                </button>
            </div>
        </div>
    );
};
