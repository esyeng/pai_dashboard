// contexts/ChatContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { queryModel, fetchThreads, fetchUser, createThread } from "../lib/api";
import { formatDate } from "@/lib/utils";
import { Thread, Threads, User, MessageObject } from "@/lib/types";
import { agents, models } from "@/lib/store"

export interface ChatContextType {
    threads: Threads;
    activeMessageQueue: MessageObject[];
    user: User | null;
    currentThreadId: string;
    agentId: string;
    modelId: string;
    setUser: (user: User) => void;
    setModelId: (modelId: string) => void;
    setAgentId: (agentId: string) => void;
    sendChat: (
        message: string,
        model: string,
        agentId: string,
        senderName: string,
        maxTokens?: number,
        temperature?: number
    ) => Promise<void>;
    switchThread: (threadId: string) => void;
    createNewThread: () => void;
    setThreads: (threads: Threads) => void;
    isLoading?: boolean;
}

interface ChatProviderProps {
    children: React.ReactNode;
}

const _createID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [agentId, setAgentId] = useState<string>("jasmyn");
    const [modelId, setModelId] = useState<string>("claude-3-opus-20240229");
    const [user, setUser] = useState<User | null>(null);
    const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
    const [currentThreadId, setCurrentThreadId] = useState<string>("1");
    const [threads, setThreads] = useState<any>({});
    const [activeMessageQueue, setActiveMessageQueue] = useState<MessageObject[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseMsg, setResponseMsg] = useState<MessageObject | null>(null);
    const [idx, setIdx] = useState<number>(0);
    const [idy, setIdy] = useState<number>(10000);

    useEffect(() => {
        if (responseMsg) {
            setIsLoading(false);
            setActiveMessageQueue((prev) => [...prev, responseMsg]);
            setThreads((prev: Threads) => ({
                ...prev,
                [currentThreadId]: [...(prev[currentThreadId]["messages"]), responseMsg] ,
            }));
        }
    }, [responseMsg]);

    useEffect(() => {
        const fetchData = async () => {
            const authenticatedUserObject = await fetchUser();
            if (authenticatedUserObject) {
                setUser(authenticatedUserObject);
            }
        };

        fetchData();

        return () => {
            console.log("cleaning up...");
        };
    }, []);

    useEffect(() => {
        const fetchThreadsData = async () => {
            const fetchedThreads = await fetchThreads();
            setThreads(fetchedThreads ? fetchedThreads : {"test": {
                id: "test",
                title: "Test Thread",
                createdAt: formatDate(new Date()),
                userId: "1",
                path: "/thread/test",
                messages: [
                    {
                        id: 1,
                        timestamp: formatDate(new Date()),
                        agentId: "jasmyn",
                        sender: "jasmyn",
                        role: "assistant",
                        content: "Hello, world!",
                    },
                ],
            } });
        };

        fetchThreadsData();
        return () => {
            console.log("cleaning up...");
            console.log("threads from context", threads);
        }
    } , []);

    const sendChat = async (
        message: string,
        model: string,
        agentId: string,
        senderName: string,
        maxTokens?: number,
        temperature?: number
    ) => {
        const newMsg: MessageObject = {
            id: idx,
            timestamp: Date.now(),
            agentId: agentId,
            sender: senderName,
            role: "user",
            content: message,
        };
        setThreads((prev: Threads) => ({
            ...prev,
            [currentThreadId]: [...(prev[currentThreadId]["messages"]), newMsg],
        }));
        setIdx((prev) => prev + 1);
        const updatedQueue = [...activeMessageQueue, newMsg].slice(-7);
        setActiveMessageQueue(updatedQueue);
        const messagesToSend = updatedQueue.map((msg) => ({
            role: msg.sender,
            content: msg.content,
        }));

        try {
            setIsLoading(true);
            const response = await queryModel({
                max_tokens: maxTokens || 2000,
                model: model || "claude-3-opus-20240229",
                temperature: temperature || 0.3,
                agent_id: agentId,
                messages: messagesToSend,
            });
            const receivedMsg: MessageObject = {
                id: idy,
                timestamp: Date.now(),
                agentId: agentId,
                sender: agentId,
                role: "assistant",
                content: response?.response || "If you're reading this, it means it didn't work. :(",
            };
            setIdy((prev) => prev + 1);
            setResponseMsg(receivedMsg);
        } catch (error) {
            console.error("Error sending chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const switchThread = (threadId: string) => {
        setCurrentThreadId(threadId);
        setActiveMessageQueue([]);
    };

    const createNewThread = () => {
        const newThreadId = _createID();
        setCurrentThreadId(newThreadId);
        setThreads((prev: any) => ({
            ...prev,
            [newThreadId]: [],
        }));
        setActiveMessageQueue([]);
    };

    return (
        <ChatContext.Provider
            value={{
                threads,
                currentThreadId,
                activeMessageQueue,
                user,
                agentId,
                modelId,
                setUser,
                setModelId,
                setAgentId,
                sendChat,
                switchThread,
                createNewThread,
                setThreads,
                isLoading,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
