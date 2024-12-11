import React, { useState, useEffect } from 'react';
import { Message } from './Message';

interface StreamingMessageProps {
    id: any;
    msg: { role: string; content: string };
    timestamp: any;
    sender: string;
    agentId: string;
    interval?: number;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ id, msg, timestamp, sender, agentId, interval = 5 }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index < msg.content.length) {
                setDisplayedContent((prev) => prev + msg.content[index]);
                index++;
            } else {
                clearInterval(timer);
                setIsComplete(true);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [msg.content, interval]);

    return (
        <div className="streaming-message">
            <Message id={id}
                msg={{ role: msg.role, content: displayedContent }}
                timestamp={timestamp}
                sender={sender}
                agentId={agentId}
            />
            {!isComplete && (
                <span className="cursor animate-pulse">▋</span>
            )}
        </div>
    );
};

