// contexts/ChatContext.tsx
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
} from "react";
import {
	queryModel,
	fetchThreads,
    fetchAssistants,
    fetchModels,
	fetchUser,
	saveNewThread,
	updateThreadMessages,
	parseMessageString,
} from "../lib/api";
import { formatDate } from "@/lib/utils";
import { Thread, Threads, User, MessageProps } from "@/lib/types";
// import { agents, models } from "@/lib/store";
import { useAuth } from "@clerk/nextjs";
import { v4 as uuidv4 } from 'uuid';

// interface AgentDict {
// 	[key: string]: string;
// }

const _convertToMarkdown = (thread: Thread | any): string => {
	let markdown = `# ${thread.title}\n\n`;
	thread.messages?.forEach((message: any) => {
		let msg = typeof message === "string" ? parseMessageString(message) : message;
		if (typeof msg === "string") {
			msg = parseMessageString(msg);
		}
		if (typeof msg === "string") {
			msg = parseMessageString(msg);
		}
		markdown += `**${msg.sender}:** ${msg.msg.content}\n\n`;
	});
	return markdown;
};

export interface ChatContextType {
	threads: Threads;
    agents: any;
    models: any;
	activeMessageQueue: MessageProps[];
	user: User | null;
	currentThreadId: string | number;
	agentId: string;
	modelId: string;
	loadComplete: boolean;
	setToken: (token: string | Promise<string> | any) => void;
	setUser: (user: User) => void;
	setModelId: (modelId: string) => void;
	setAgentId: (agentId: string) => void;
	sendChat: (
		message: string,
		model: string,
		agentId: string,
		currentThreadId: string | number,
		maxTokens?: number,
		temperature?: number
	) => Promise<void>;
	switchThread: (threadId: string) => void;
	createNewThread: () => Promise<any>;
	deleteThread: (threadId: string) => Promise<void>;
	exportThread: (thread: Thread) => void;
	fetchThreadsData: (token: string | Promise<string>) => Promise<Thread[]>;
	setThreads: (threads: Threads) => void;
	isLoading?: boolean;
}

interface ChatProviderProps {
	children: React.ReactNode;
}

const _createID = () => {
    const date = new Date()
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${(Math.random() * 100).toPrecision(2)}`;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
	const [agentId, setAgentId] = useState<string>("jasmyn");
	const [token, setToken] = useState<
		any | Promise<string> | string | undefined
	>();
	const [modelId, setModelId] = useState<string>("claude-3-opus-20240229");
	const [user, setUser] = useState<User | null>(null);
	const [currentThreadId, setCurrentThreadId] = useState<string | number>(1);
	const [threads, setThreads] = useState<Threads | any>({});
    const [agents, setAgents] = useState<any>([]);
    const [models, setModels] = useState<any>([]);
	const [messagesInActiveThread, setMessagesInActiveThread] = useState<
		MessageProps[]
	>([]);
	const [activeMessageQueue, setActiveMessageQueue] = useState<
		MessageProps[]
	>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [responseMsg, setResponseMsg] = useState<MessageProps | null>(null);
	const [loadComplete, setLoadComplete] = useState<boolean>(false);
    const [threadsLoaded, setThreadsLoaded] = useState<boolean>(false);

	const updateThreadMessagesAsync = async (
		threadId: string | number,
		messages: any[]
	) => {
		try {
			console.log("updating thread messages...");
			await updateThreadMessages(threadId, messages);
		} catch (error) {
			console.error("Error updating thread messages:", error);
		}
	};

    const getAgents = async (user: any) => {
        console.log("get agents called");
        const agents = await fetchAssistants();
        const models = await fetchModels();
        if (agents) {
            console.log("user object in getAgents", user)
            setAgents(agents);
        }
        if (models) {
            setModels(models);
            console.log("models", JSON.stringify(models));
        }
    }

	// effects

    useEffect(() => {
        if (threadsLoaded && currentThreadId && threads[currentThreadId]) {
            setActiveMessageQueue(threads[currentThreadId].messages.slice(-7));
            setMessagesInActiveThread(threads[currentThreadId].messages);
        }
    }, [threadsLoaded, currentThreadId, threads]);

	// updates threads with response message
	useEffect(() => {
		if (responseMsg && currentThreadId) {
			setIsLoading(false);
			setMessagesInActiveThread((prev) => [...prev, responseMsg]);
			setThreads((prev: Threads | any) => ({
				...prev,
				[currentThreadId]: {
					...prev[currentThreadId],
					messages: [...prev[currentThreadId].messages, responseMsg],
				},
			}));
		}

		return () => {
			console.log("cleaning up response message...");
		};
	}, [responseMsg]);

	useMemo(() => {
		if (
			messagesInActiveThread &&
			messagesInActiveThread.length >= 2 &&
			messagesInActiveThread.length % 2 === 0
            && currentThreadId
		) {
			console.log("even number of messages in active thread");

			updateThreadMessagesAsync(currentThreadId, [
				...messagesInActiveThread,
			]);

			// update db after a response is received
		}
	}, [messagesInActiveThread]);

	// sets loadComplete once token promise resolves
	useEffect(() => {
		if (token) {
			setLoadComplete(true);
		}
		return () => {
			console.log("cleaning up load complete...");
		};
	}, [token]);

	useEffect(() => {
		if (loadComplete) {
			// console.log("fetching user...");
			// console.log("token", token);
			fetchData();
			console.log("fetching threads...");
			fetchThreadsData(token);
		}
		return () => {
			console.log("cleaning up fetch data...");
		};
	}, [loadComplete]);

	// chat & threads methods

	/**
	 * @method fetchThreadsData
	 * @param token: string | Promise<string>
	 * @returns fetchedThreads: Thread[]
	 */
	const fetchThreadsData = async (token: any): Promise<Thread[] | any> => {
        console.log("fetching threads...");
        try {
            const fetchedThreads: Thread[] | any[] = await fetchThreads(token);
            console.log("about to setThreads to fetchedThreads");
            const threadsObject = fetchedThreads.reduce((acc, thread) => {
                acc[thread.id] = thread;
                return acc;
            }, {} as Threads);
            setThreads(threadsObject);
            console.log("fetchedThreads", fetchedThreads);

            // Set the most recent thread as the current thread
            if (fetchedThreads.length > 0) {
                const latestThread = fetchedThreads[fetchedThreads.length - 1];
                setCurrentThreadId(latestThread.id);
                setActiveMessageQueue(latestThread.messages.slice(-7));
                setMessagesInActiveThread(latestThread.messages);
            }

            setThreadsLoaded(true);
            return fetchedThreads;
        } catch (error) {
            console.error("Error fetching threads:", error);
            throw error;
        }
    };


	/**
	 * @method fetchData
	 * @returns authenticatedUserObject: any
	 */
	const fetchData = async () => {
		try {
			const t = await token;
			const authenticatedUserObject = await fetchUser(t);
			// console.log("authenticatedUserObject", authenticatedUserObject);
			if (authenticatedUserObject) {
				setUser(authenticatedUserObject);
                console.log("authenticated user object", authenticatedUserObject);
                clearNoteStorage(authenticatedUserObject);
                getAgents(authenticatedUserObject);
				setToken(t);
			} else {
				throw new Error("Failed to fetch user");
			}
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	};

    const clearNoteStorage = (user: any) => {
        const noteId = localStorage.getItem("note user id");
        if (noteId !== "") {
            if (noteId !== user.id) {
                localStorage.setItem("notes", "");
                localStorage.setItem("note user id", user.id);
            }
        } else {
            localStorage.setItem("note user id", user.id);
        }
    }

	/**
	 * @method sendChat
	 * @param message
	 * @param model
	 * @param agentId
	 * @param currentThreadId
	 * @param maxTokens
	 * @param temperature
	 * @returns void
	 */
	const sendChat = async (
		message: string,
		model: string,
		agentId: string,
		currentThreadId: string | number,
		maxTokens?: number,
		temperature?: number
	) => {
		const newMsg: MessageProps = {
			id: uuidv4(),
			timestamp: Date.now(),
			agentId: agentId,
			sender: user?.firstName || "anonymousUser",
			msg: {
				role: "user",
				content: message,
			},
		};
		console.log("currentThreadId", currentThreadId);
		// console.log("currentThread", threads[currentThreadId]);
		setThreads((prev: Threads | any) => {
			{
				console.log("previous thread ye", prev[currentThreadId]);
				return {
					...prev,
					[currentThreadId]: prev[currentThreadId]?.messages
						? {
								...prev[currentThreadId],
								messages: [
									...prev[currentThreadId].messages,
									newMsg,
								],
							}
						: {
								...prev[currentThreadId],
								messages: [newMsg],
							},
				};
			}
		});
		const updatedQueue = [...activeMessageQueue, newMsg].slice(-7);
		setActiveMessageQueue(updatedQueue);
		console.log("active queue???:", activeMessageQueue);
		const messagesToSend = updatedQueue.map((msg) => {
			console.log("MSG TO SEND LINE 272!!!", msg);
			console.log("TYPE OF MSG TO SEND LINE 272!!!", typeof msg);
			const messageToSend =
				typeof msg === "string" ? parseMessageString(msg) : msg;
			return {
				role: messageToSend.msg.role,
				content: messageToSend.msg.content,
			};
		});
		console.log("messages to send", messagesToSend);

		try {
			setIsLoading(true);
			if (token && user) {
				const response = await queryModel(
					{
						max_tokens: 3000,
						model: model || "claude-3-opus-20240229",
						temperature: temperature || 0.6,
						agent_id: agentId,
						messages: messagesToSend,
						currentThreadId: currentThreadId,
                        // session_id: user.
					},
					token
				);
				const receivedMsg: MessageProps = {
					id: uuidv4(),
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
				setResponseMsg(receivedMsg);
			}
		} catch (error) {
			console.error("Error sending chat:", error);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * @method switchThread
	 * @param threadId
	 * @returns void
	 */
	const switchThread = (threadId: string) => {
		setCurrentThreadId(threadId);
		setActiveMessageQueue([...threads[threadId].messages.slice(-7)]);
		setMessagesInActiveThread([...threads[threadId].messages]);
	};

	/**
	 * @method createNewThread
	 * @returns void
	 */
	const createNewThread = async () => {
		const newThreadId = _createID();
		setCurrentThreadId(newThreadId);
		setThreads((prev: Threads) => ({
			...prev,
			[newThreadId]: {
				id: newThreadId,
				title: "New Thread",
				createdAt: formatDate(new Date()),
				messages: [] as unknown[],
			},
		}));
		setActiveMessageQueue([]);
		// console.log("user", user);
		if (user) {
			console.log("now saving new thread");
			return await saveNewThread(
				newThreadId,
				newThreadId,
				user.user.id,
				[]
			);
		}
	};

	const deleteThread = async (threadId: string | number) => {
		// const response = await fetch(`${BASE}/db/threads/${threadId}`, {
		//     method: "DELETE",
		// });
		console.log("call to backend: delete thread");
	};

	const exportThread = (threadId: string | number | any): void => {
		const markdownContent = _convertToMarkdown(threads[threadId]);
		const file = new Blob([markdownContent], {
			type: "text/plain",
		});
		const url = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${threads[threadId].title}.txt`;
		link.click();
	};

	return (
		<ChatContext.Provider
			value={{
				threads,
                agents,
                models,
				currentThreadId,
				activeMessageQueue,
				user,
				agentId,
				setToken,
				modelId,
				loadComplete,
				setUser,
				setModelId,
				setAgentId,
				sendChat,
				switchThread,
				createNewThread,
				deleteThread,
				exportThread,
				setThreads,
				fetchThreadsData,
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
