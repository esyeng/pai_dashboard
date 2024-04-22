'use client'

import React from 'react';
import { useCopyToClipboard } from '../../lib/hooks/use-copy-to-clipboard';

interface MessageProps {
  role: string;
  content: string;
}

export const Message: React.FC<MessageProps> = ({ role, content }) => {
const { isCopied, copyToClipboard } = useCopyToClipboard({});

const isUserMessage = role === 'user';
const messageClass = isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-100';
const alignmentClass = isUserMessage ? 'self-end' : 'self-start';


  return (
    <div className={`flex ${alignmentClass} mb-2`}>
      <div
        className={`px-4 py-2 rounded-lg ${messageClass} relative`}
        style={{ maxWidth: '80%' }}
      >
        <button
          className="absolute top-1 right-1 text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => copyToClipboard(content)}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
        <span className="block">{content}</span>
      </div>
    </div>
  );
};
