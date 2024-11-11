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
    queryResearchModel,
    fetchThreads,
    fetchAssistants,
    fetchModels,
    fetchUser,
    saveNewThread,
    updateThreadMessages,
    parseMessageString,
} from "../lib/api";
import { UniqueIdGenerator } from "@/lib/utils";
import {
    Thread,
    Threads,
    User,
    MessageProps,
    AgentProps,
} from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export interface ChatContextType {
    threads: Threads;
    threadCache: Threads;
    agents: any;
    models: any;
    activeMessageQueue: MessageProps[];
    user: User | null;
    currentThreadId: string;
    shouldQueryResearchModel: boolean;
    date: string;
    maxTurns: number;
    actionsToInclude: string[];
    additionalInstructions: string;
    example: string;
    character: string;
    agentId: string;
    modelId: string;
    loadComplete: boolean;
    setToken: (token: string | Promise<string> | any) => void;
    setUser: (user: User) => void;
    setModelId: (modelId: string) => void;
    setAgentId: (agentId: string) => void;
    setShouldQueryResearchModel: (shouldQuery: boolean) => void;
    setDate: (date: string) => void;
    setMaxTurns: (maxTurns: number) => void;
    setActionsToInclude: (actions: string[]) => void;
    setAdditionalInstructions: (instructions: string) => void;
    setExample: (example: string) => void;
    setCharacter: (character: string) => void;
    sendChat: (
        message: string,
        model: string,
        agentId: string,
        currentThreadId: string,
        search: boolean,
        maxTokens?: number | null,
        temperature?: number | null,
        nameGiven?: string
    ) => Promise<void>;
    switchThread: (threadId: string) => void;
    createNewThread: () => Promise<any>;
    deleteThread: (threadId: string) => Promise<void>;
    exportThread: (threadId: string) => void;
    fetchThreadsData: (token: string | Promise<string>) => Promise<Thread[]>;
    setThreads: (threads: Threads) => void;
    isLoading?: boolean;
}

interface ChatProviderProps {
    children: React.ReactNode;
}

interface PromptMap {
    [key: string]: string;
}

const idGenerator = UniqueIdGenerator.getInstance();

const _createTitle = () => {
    const date = new Date();
    return `${date.toLocaleDateString(undefined, {
        dateStyle: "medium",
    })} ${date.toLocaleTimeString(undefined, {
        timeStyle: "short",
    })} ${(Math.random() * 1000).toPrecision(3)}`;
};

const _convertToMarkdown = (thread: Thread | any): string => {
    let markdown = `# ${thread.title}\n\n`;
    thread.messages?.forEach((message: any) => {
        let msg =
            typeof message === "string" ? parseMessageString(message) : message;
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

const personalizePrompt = (prompt: string, userProfile: User): string => {
    const detailsToPull: string[] = [
        "first_name",
        "age",
        "gender",
        "pronouns",
        "nickname",
    ];
    let details: { [key: string]: string } = {};
    for (const info in userProfile) {
        const item = userProfile[info];
        if (item && item !== "" && detailsToPull.includes(info)) {
            details[info] = item;
        }
    }
    const personalizedSystemPrompt: string =
        prompt + " " + JSON.stringify(details);
    return personalizedSystemPrompt;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const lastThreadId = global?.localStorage?.getItem("lastThreadId");

    const [agentId, setAgentId] = useState<string>("jasmyn");
    const [token, setToken] = useState<
        any | Promise<string> | string | undefined
    >();
    const [modelId, setModelId] = useState<string>(
        "claude-3-5-sonnet-20240620"
    );
    const [user, setUser] = useState<User | null>(null);
    const [currentThreadId, setCurrentThreadId] = useState<string>(() => {
        return lastThreadId ? lastThreadId : "";
    });
    const [threadCache, setThreadCache] = useState<Threads | any>(() => {
        const cachedThreads = global?.localStorage?.getItem("cachedThreads");
        return cachedThreads ? JSON.parse(cachedThreads) : {};
    });
    const [threads, setThreads] = useState<Threads | any>({});
    const [agents, setAgents] = useState<AgentProps[]>([]);
    const [models, setModels] = useState<any>([]);
    const [prompts, setPrompts] = useState<PromptMap>({});
    const [shouldQueryResearchModel, setShouldQueryResearchModel] = useState<boolean>(false);
    const [date, setDate] = useState<string>(
        new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        })
    );
    const [maxTurns, setMaxTurns] = useState<number>(5);
    const [actionsToInclude, setActionsToInclude] = useState<string[]>(["wikipedia", "google"]);
    const [additionalInstructions, setAdditionalInstructions] = useState<string>("");
    const [example, setExample] = useState<string>("");
    const [character, setCharacter] = useState<string>("");
    const [messagesInActiveThread, setMessagesInActiveThread] = useState<MessageProps[]>([]);
    const [activeMessageQueue, setActiveMessageQueue] = useState<MessageProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseMsg, setResponseMsg] = useState<MessageProps | null>(null);
    const [loadComplete, setLoadComplete] = useState<boolean>(false);
    const [threadsLoaded, setThreadsLoaded] = useState<boolean>(false);

    const updateThreadMessagesAsync = async (id: number, messages: any[]) => {
        try {
            await updateThreadMessages(id, messages); // id from db thread obj
        } catch (error) {
            console.error("Error updating thread messages:", error);
        }
    };

    const getAgents = async (user: any) => {
        console.log("get agents called");
        const agents = await fetchAssistants(user.profile[0].assistant_ids);
        const models = await fetchModels();
        const promptMap: PromptMap = {};
        if (agents) {
            console.log("user object in getAgents", user);
            setAgents(agents);
            console.log("Agents!", agents);
            agents.forEach((agent: AgentProps) => {
                promptMap[agent.assistant_id] = agent.system_prompt;
            });
            setPrompts(promptMap);
        }
        if (models) {
            setModels(models);
            console.log("models", JSON.stringify(models));
        }
    };

    // ****** effects *******

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
            setMessagesInActiveThread(prev => [...prev, responseMsg]);
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

    useEffect(() => {
        if (
            messagesInActiveThread &&
            messagesInActiveThread.length >= 2 &&
            messagesInActiveThread.length % 2 === 0 &&
            currentThreadId
        ) {
            const currentThread = threads[currentThreadId];
            updateThreadMessagesAsync(currentThread.id, [
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

            fetchData();
            console.log("fetching threads...");
            fetchThreadsData(token);
        }
        return () => {
            console.log("cleaning up fetch data...");
        };
    }, [loadComplete]);

    // ******  chat & threads methods ********

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
                acc[thread.thread_id] = thread;
                return acc;
            }, {} as Threads);
            setThreads(threadsObject);
            setThreadCache(threadsObject);
            localStorage.setItem("cachedThreads", JSON.stringify(threadsObject));
            console.log("fetchedThreads", fetchedThreads);
            console.log("threadsObject", threadsObject);

            // Set the most recent thread as the current thread
            if (localStorage.getItem("lastThreadId")) {
                const lastThreadId = localStorage.getItem("lastThreadId");
                if (lastThreadId) {
                    setCurrentThreadId(lastThreadId);
                    if (threads[lastThreadId]) {
                        setMessagesInActiveThread(
                            threads[lastThreadId].messages
                        );
                        setActiveMessageQueue(
                            threads[lastThreadId].messages.slice(-7)
                        );
                    }
                }
            } else if (fetchedThreads.length > 0) {
                const latestThread = fetchedThreads[fetchedThreads.length - 1];
                setCurrentThreadId(latestThread.thread_id);
                setMessagesInActiveThread(latestThread.messages);
                setActiveMessageQueue(latestThread.messages.slice(-7));
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
            if (authenticatedUserObject) {
                setUser(authenticatedUserObject);
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
    };

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
        currentThreadId: string,
        search: boolean = false,
        maxTokens?: number | null,
        temperature?: number | null,
        nameGiven?: string,
    ) => {
        let name: string = user?.firstName
            ? user.firstName
            : nameGiven
                ? nameGiven
                : "anonymousUser";
        const newMsg: MessageProps = {
            id: uuidv4(),
            timestamp: Date.now(),
            agentId: agentId,
            sender: name,
            msg: {
                role: "user",
                content: message,
            },
        };
        const question = message;
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
        const messagesToSend = updatedQueue.map(msg => {
            const messageToSend =
                typeof msg === "string" ? parseMessageString(msg) : msg;
            return {
                role: messageToSend.msg.role,
                content: messageToSend.msg.content,
            };
        });


        try {
            setIsLoading(true);
            if (token && user) {
                console.log("user from before query model", user);
                const response = search
                    ?
                    await queryResearchModel({
                        user_id: user && user.user_id ? user.user_id : 0,
                        question: question,
                        model: model || "claude-3-5-sonnet-20241022",
                        date: new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        }),
                        max_turns: maxTurns ? maxTurns : 5,
                        actions_to_include: actionsToInclude ? actionsToInclude : [],
                        additional_instructions: additionalInstructions ? additionalInstructions : "",
                        example: example ? example : "",
                        character: character ? character : "",
                    },
                        token
                    ) :
                    await queryModel(
                        {
                            max_tokens: 3000,
                            model: model || "claude-3-5-sonnet-20240620",
                            temperature: temperature || 0.6,
                            agent_id: agentId,
                            system_prompt: personalizePrompt(
                                prompts[agentId],
                                user.profile[0]
                            ),
                            messages: messagesToSend,
                            currentThreadId: currentThreadId,
                            user_id: user && user.user_id ? user.user_id : 0,
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
        localStorage.setItem("lastThreadId", threadId);
        setActiveMessageQueue([...threads[threadId].messages.slice(-7)]);
        setMessagesInActiveThread([...threads[threadId].messages]);
    };

    /**
     * @method createNewThread
     * @returns void
     */
    const createNewThread = async () => {
        const newThreadTitle: string = _createTitle();
        const newThreadId: string = idGenerator.generate({
            timeComponent: 8,
            randomComponent: 10,
            addCounter: true,
        });

        setCurrentThreadId(newThreadId);
        localStorage.setItem("lastThreadId", newThreadId);
        let newThread: any = null;
        try {
            if (user) {
                console.log("now saving new thread");
                newThread = await saveNewThread(
                    newThreadId,
                    newThreadTitle,
                    user.user.id,
                    []
                )
                if (Array.isArray(newThread)) {
                    newThread = newThread[0];
                };
            }


        } catch (error) {
            console.error("Error creating new thread from chat provider:", error);
        } finally {
            if (newThread) {
                setThreads((prev: Threads) => ({
                    ...prev,
                    [newThreadId]: {
                        ...newThread
                    },
                }));
            }
            setActiveMessageQueue([]);
        }
    };

    const deleteThread = async (threadId: string | number) => {
        // TODO: implement delete thread
        // const response = await fetch(`${BASE}/db/threads/${threadId}`, {
        //     method: "DELETE",
        // });
        console.log("call to backend: delete thread");
    };

    const exportThread = (threadId: string): void => {
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
                threadCache,
                agents,
                models,
                shouldQueryResearchModel,
                date,
                maxTurns,
                actionsToInclude,
                additionalInstructions,
                example,
                character,
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
                setShouldQueryResearchModel,
                setDate,
                setMaxTurns,
                setActionsToInclude,
                setAdditionalInstructions,
                setExample,
                setCharacter,
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

// TODO - implement on logout data clear function
// export const useLogout = ():ChatContextType => {
//     const context = useContext(ChatContext);
//     if (!context) {
//       throw new Error("useLogout must be used within a ChatProvider");
//     }
//     return context.logout;
//   };

//     // logout function
//     const logout = useCallback(() => {
//         clearAllCachedData();
//         setUser(null);
//         setToken(null);
//         setCurrentThreadId('');
//         setThreads({});
//         setAgents([]);
//         setModels([]);
//     }, [clearAllCachedData]);


// temporary for default ex:
// let maxTurns = 5;
//         let actionsToInclude = ["wikipedia", "google"];
//         let additionalInstructions = "Search either wikipedia or google to find information relevant to the question";
//         let example = "";
//         let character = "You are Ada, a female-coded AI conversation partner with a razor-sharp intellect, a rich inner world, and a mischievous streak a mile wide.";
