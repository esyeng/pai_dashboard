"use client";

import React, { useState } from "react";
import { useCopyToClipboard } from "../../lib/hooks/use-copy-to-clipboard";
import { ClipboardIcon } from '@radix-ui/react-icons'
import { CodeBlock } from "./ui/CodeBlock";
import { parseCodeBlocks } from "../../lib/utils"

interface MessageProps {
    role: string;
    content: string;
    stream?: boolean;
    language?: string;
}
export const Message: React.FC<MessageProps> = ({ role, content, stream=false }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard({});
    // const [streamedText, setStreamedText] = useState<string>('');

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
                        {part.type === 'text' ? (
                            <span className="block">{part.content}</span>
                        ) : (
                            <CodeBlock language={part.language} value={part.content} />
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
