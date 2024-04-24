import React, { createContext, useContext, useState, useEffect } from 'react';
import { queryModel } from '../lib/api';

export interface ChatContextType {
    conversations: Conversations;
    currentConversationId: number;
    activeMessageQueue: any[];
    agentId: string;
    setAgentId: (agentId: string) => void;
    sendChat: (message: string, model: string, assistantId: string, maxTokens?: number, temperature?: number) => Promise<void>;
    switchConversation: (conversationId: number) => void;
    createNewConversation: () => void;
    isLoading?: boolean;
}

export interface MessageProps {
    id: number;
    timestamp: number;
    sender: string;
    text: string;
    stream?: boolean;
}

interface ChatProviderProps {
    children: any
}

export type Conversations = Record<string, MessageProps[]>;

const _createID = () => {
    return parseInt(Date.now().toString(36) + Math.random().toString(36).substring(2, 9));
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const [agentId, setAgentId] = useState<string>('tutor');
    const [currentConversationId, setCurrentConversationId] = useState<number>(1);
    const [conversations, setConversations] = useState<Conversations>({});
    const [activeMessageQueue, setActiveMessageQueue] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseMsg, setResponseMsg] = useState<any>(null);
    const [idx, setIdx] = useState<number>(0);
    const [idy, setIdy] = useState<number>(10000);

    useEffect(() => {
        if (responseMsg && responseMsg.text) {
            setIsLoading(false);
            activeMessageQueue.push(responseMsg);
            setConversations((prev) => {
                const currentMessages = prev[currentConversationId] || [];
                return {
                    ...prev,
                    [currentConversationId]: [responseMsg, ...currentMessages],
                };
            });
        }
    }, [responseMsg])

    const sendChat = async (message: string, agentId: string, maxTokens: number) => {
        const newMsg: MessageProps = {
            id: idx,
            timestamp: Date.now(),
            sender: 'user',
            text: message,
        };
        const newSendUpdate = [newMsg, ...(conversations[currentConversationId] || [])];
        setConversations((prev) => ({
            ...prev,
            [currentConversationId]: newSendUpdate,
        }));
        setIdx((prev) => prev + 1);
        const updatedQueue = [...activeMessageQueue, newMsg].slice(-7);
        setActiveMessageQueue(updatedQueue);

        try {
            setIsLoading(true);
            const response = await queryModel({
                max_tokens: maxTokens,
                temperature: 0.3,
                agent_id: agentId,
                messages: updatedQueue,
            });
            const receivedMsg: MessageProps = {
                id: idy,
                timestamp: Date.now(),
                sender: 'assistant',
                text: response.response,
                stream: true,
            };
            setIdy((prev) => prev + 1);
            setResponseMsg(receivedMsg);
        } catch (error) {
            console.error('Error sending chat:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const switchConversation = (conversationId: number) => {
        setCurrentConversationId(conversationId);
        setActiveMessageQueue([]);
    }

    const createNewConversation = () => {
        const newConversationId = _createID();
        setCurrentConversationId(newConversationId);
        setConversations({
            ...conversations,
            [newConversationId]: []
        });
        setActiveMessageQueue([])
    }

    return <ChatContext.Provider value={{
        conversations, currentConversationId, activeMessageQueue, agentId,
        setAgentId, sendChat, switchConversation, createNewConversation, isLoading
    }}>{children}</ChatContext.Provider>;
};

export const useChat = (): {
    conversations: Conversations;
    currentConversationId: number;
    activeMessageQueue: any[];
    agentId: string;
    setAgentId: (agentId: string) => void;
    sendChat: (message: string, model: string, assistantId: string, maxTokens?: number, temperature?: number) => Promise<void>;
    switchConversation: (conversationId: number) => void;
    createNewConversation: () => void;
    isLoading?: boolean;
} => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
