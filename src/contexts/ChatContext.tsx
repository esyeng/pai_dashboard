// contexts/ChatContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { queryModel, fetchThreads, fetchUser, createThread } from "../lib/api";
import { formatDate } from "@/lib/utils";
import { Thread, Threads, User, MessageProps } from "@/lib/types";
import { agents, models } from "@/lib/store";
import { useAuth } from "@clerk/nextjs";

export interface ChatContextType {
  threads: Threads;
  activeMessageQueue: MessageProps[];
  user: User | null;
  currentThreadId: string | number;
  agentId: string;
  modelId: string;
  setToken: (token: any) => void;
  setUser: (user: User) => void;
  setModelId: (modelId: string) => void;
  setAgentId: (agentId: string) => void;
  sendChat: (
    message: string,
    model: string,
    agentId: string,
    senderName: string,
    currentThreadId: string | number,
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
  const [token, setToken] = useState<Promise<string> | string | undefined>();
  const [modelId, setModelId] = useState<string>("claude-3-opus-20240229");
  const [user, setUser] = useState<User | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | number>(1);
  const [threads, setThreads] = useState<any>({});
  const [activeMessageQueue, setActiveMessageQueue] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<MessageProps | null>(null);
  const [idx, setIdx] = useState<number>(0);
  const [idy, setIdy] = useState<number>(10000);

const fetchThreadsData = async (token: string | Promise<string>) => {
	console.log("fetching threads...");
	const fetchedThreads: any = await fetchThreads(token);
	console.log("about to setThreads to fetchedThreads");
	if (fetchedThreads[0]) {
		setThreads(fetchedThreads[0]);
		console.log("fetchedThreads", fetchedThreads);
		if (fetchedThreads && fetchedThreads[0][currentThreadId].messages) {

			setActiveMessageQueue(fetchedThreads[0][currentThreadId].messages);
		}
	}
	return fetchedThreads;
};

  useEffect(() => {
    if (
      threads &&
      threads[currentThreadId] &&
      threads[currentThreadId]["messages"].length > 0
    ) {
      setActiveMessageQueue([...threads[currentThreadId].messages]);
    }
  }, []);

  useEffect(() => {
    if (responseMsg) {
      setIsLoading(false);
      setActiveMessageQueue((prev) => [...prev, responseMsg]);
      setThreads((prev: Threads) => ({
        ...prev,
        [currentThreadId]: {
          ...prev[currentThreadId],
          messages: [...prev[currentThreadId]["messages"], responseMsg],
        },
      }));
    }
  }, [responseMsg]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const t = await token;
        const authenticatedUserObject = await fetchUser(t);
        console.log("authenticatedUserObject", authenticatedUserObject);
        if (authenticatedUserObject) {
          setUser(authenticatedUserObject);
          setToken(t);
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (token) {
      console.log("fetching user...");
      console.log("token", token);
      fetchData();
      console.log("fetching threads...");
      fetchThreadsData(token);
    }

    return () => {
      console.log("cleaning up...");
    };
  }, [token]);

  // useEffect(() => {

  // 	if (token && user) {

  // 	}
  // 	return () => {
  // 		console.log("cleaning up...");
  // 		console.log("threads from context", threads);
  // 	};
  // }, []);

  const sendChat = async (
    message: string,
    model: string,
    agentId: string,
    senderName: string,
    currentThreadId: string | number,
    maxTokens?: number,
    temperature?: number
  ) => {
    const newMsg: MessageProps = {
      id: idx,
      timestamp: Date.now(),
      agentId: agentId,
      sender: senderName,
      msg: {
        role: "user",
        content: message,
      },
    };
    console.log("currentThreadId", currentThreadId);
    console.log("currentThread", threads[currentThreadId]);
    setThreads((prev: Threads) => {
      if (!prev[currentThreadId]?.messages) {
        console.log("no previous thread", prev);
        return {
          ...prev,
          [currentThreadId]: {
            id: currentThreadId,
            title: "New Thread",
            createdAt: formatDate(new Date()),
            messages: [newMsg],
          },
        };
      } else {
        console.log("previous thread ye", prev[currentThreadId]);
        return {
          ...prev,
          [currentThreadId]: {
            ...prev[currentThreadId],
            messages: [...prev[currentThreadId]["messages"], newMsg],
          },
        };
      }
    });
    setIdx((prev) => prev + 1);
    const updatedQueue = [...activeMessageQueue, newMsg].slice(-7);
    setActiveMessageQueue(updatedQueue);
    console.log("active queue???:", activeMessageQueue);
    const messagesToSend = updatedQueue.map((msg) => ({
      role: msg.msg.role,
      content: msg.msg.content,
    }));
    console.log("messages to send", messagesToSend);

    try {
      setIsLoading(true);
      if (token && user) {
        const response = await queryModel(
          {
            max_tokens: maxTokens || 3000,
            model: model || "claude-3-opus-20240229",
            temperature: temperature || 0.6,
            agent_id: agentId,
            messages: messagesToSend,
            currentThreadId: currentThreadId,
          },
          token
        );
        const receivedMsg: MessageProps = {
          id: idy,
          timestamp: Date.now(),
          agentId: agentId,
          sender: agentId,
          msg: {
            role: "assistant",
            content:
              response?.response ||
              "If you're reading this, it means it didn't work. :(",
          },
        };
        setIdy((prev) => prev + 1);
        setResponseMsg(receivedMsg);
      }
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
        setToken,
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
