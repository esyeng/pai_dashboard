"use client";

import React from "react";
import { useCopyToClipboard } from "../../lib/hooks/use-copy-to-clipboard";

import { ClipboardIcon } from '@radix-ui/react-icons'

interface MessageProps {
    role: string;
    content: string;
}

export const Message: React.FC<MessageProps> = ({ role, content }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard({});

    const isUserMessage = role === "user";
    const messageClass = isUserMessage
        ? "bg-vista-blue text-gray"
        : "bg-jasmine text-black";
    const alignmentClass = isUserMessage ? "justify-end" : "justify-start";

    return (
        <div className={`flex ${alignmentClass} mb-4`}>
            <div
                className={`px-4 py-2 rounded-lg ${messageClass} shadow-md`}
                style={{ maxWidth: "80%" }}
            >
                <div className={`mb-2`}>{content}</div>
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
