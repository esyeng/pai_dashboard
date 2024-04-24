"use client";

import React from "react";
import { useCopyToClipboard } from "../../lib/hooks/use-copy-to-clipboard";

interface MessageProps {
  role: string;
  content: string;
}

export const Message: React.FC<MessageProps> = ({ role, content }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({});

  const isUserMessage = role === "user";
  const messageClass = isUserMessage
    ? "bg-amber-100 text-black"
    : "bg-cyan-500 text-white";
  const alignmentClass = isUserMessage ? "self-end" : "self-start";
  console.log("role", role);
  console.log("isUserMessage? ", isUserMessage);
  console.log("alignmentClass?", alignmentClass);
  return (
    <div className={`flex ${alignmentClass} mb-2`}>
      <div
        className={`flex flex-col px-4 py-2 rounded-lg ${messageClass} `}
        style={{ maxWidth: "80%" }}
      >
        <span className="block">{content}</span>
        <button
          className=" text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => copyToClipboard(content)}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};
