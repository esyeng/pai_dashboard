import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useReducer,
    useCallback,
} from "react";
import {
    queryModel,
    queryResearchModel,
    fetchThreads,
    fetchAssistants,
    fetchModels,
    fetchUser,
    saveNewThread,
    updateThreadMessages
} from "../lib/api";
import {
    UniqueIdGenerator,
    convertToMarkdown,
    createTitle,
    personalizePrompt,
    sortObjectsByCreatedAt,
} from "@/lib/utils";
import { threadsReducer } from "./threadsReducer";
import { v4 as uuidv4 } from "uuid";

/**
 * ChatContext.tsx
 *
 * ChatContext is a ReactContext object that represents which contexts other components read or provide.
 * It is the object returned from createContext, and gets passed as the argument to useContext.
 * At the end of this file the useChat hook is defined which calls useContext,
 * granting access to all variables in the ChatContext.Provider returned by this component
 * to the child component it is called from
 */


interface ChatProviderProps {
    children: React.ReactNode;
}

// Unique ID for each thread, used for selecting and updating. Is separate from db object thread.id
const idGenerator = UniqueIdGenerator.getInstance();

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [threadState, dispatchThreads] = useReducer(threadsReducer, {
        threads: {},
        currentThreadId: null,
        activeMessageQueue: [],
        messagesInActiveThread: [],
    });
    const [token, setToken] = useState<
        any | Promise<string> | string | undefined
    >();
    // Default agent, model
    const [agentId, setAgentId] = useState<string>("jasmyn");
    const [modelId, setModelId] = useState<string>(
        "claude-3-5-sonnet-20240620"
    );
    const [user, setUser] = useState<User | null>(null);
    const [threadCache, setThreadCache] = useState<Threads>({});
    const [agents, setAgents] = useState<AgentProps[]>([]);
    const [models, setModels] = useState<any>([]);
    // prompts is an object used to combine user details with character prompt for personalized messages
    const [prompts, setPrompts] = useState<PromptMap>({});
    const [shouldQueryResearchModel, setShouldQueryResearchModel] =
        useState<boolean>(false);
    // Status flags
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadComplete, setLoadComplete] = useState<boolean>(false);
    // flag for updating database thread messages
    const [updateThread, setUpdateThread] = useState<boolean>(false);

    // Research model query parameters
    const [maxTurns, setMaxTurns] = useState<number>(5);
    const [selectedActions, setSelectedActions] = useState<string[]>([
        "wikipedia",
        "google",
    ]);
    const [additionalInstructions, setAdditionalInstructions] =
        useState<string>("");
    const [example, setExample] = useState<string>("");
    const [character, setCharacter] = useState<string>("");
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const [disableQuery, setDisableQuery] = useState<boolean>(false);
    const actionsToInclude = ["wikipedia", "google", "process_urls", "write_report"];


    // fetch agents from db once user data present
    const getAgents = async (user: UserResponse) => {
        console.log("get agents called");
        console.log("user object in getAgents", user);
        if (!user || !user.profile) {
            console.log("no user object in getAgents");
            return;
        }
        const agents = await fetchAssistants(user.profile.assistant_ids);
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

    // saves convo to database thread
    // called in effect callback after message received from server
    const updateThreadSavedMessages = async (id: number, messages: MessageProps[]) => {
        try {
            const updated: [] = await updateThreadMessages(id, messages); // id from db thread obj
            if (updated && updated.length) {
                return updated;
            }
        } catch (error) {
            console.error("Error updating thread messages:", error);
        }
    };


    // ****** effects *******

    // sets loadComplete once token promise resolves
    useEffect(() => {
        if (token) {
            setLoadComplete(true);
        }
        return () => {
            console.log(
                `effect cleanup for loadComplete initialized, value: ${loadComplete}`
            );
        };
    }, [token]);

    // executes once token promise resolves, fetches and sets user data then threads
    useEffect(() => {
        if (loadComplete) {
            fetchData();
            console.log("fetching threads...");
            fetchThreadsData(token);
        }
    }, [loadComplete, token]);

    // save thread messages after each msg
    useEffect(() => {
        if (!updateThread) return
        if (threadState.currentThreadId && threadState.threads[threadState.currentThreadId].messages) {
            console.log("updating thread messages");
            updateThreadSavedMessages(threadState.threads[threadState.currentThreadId].id, threadState.threads[threadState.currentThreadId].messages);
            setUpdateThread(false);
        }
    }, [updateThread]);

    // ******  chat & threads methods ********
    /**
     * @method fetchThreadsData
     * @param token: string | null
     * @returns fetchedThreads: Thread[]
     */
    const fetchThreadsData = useCallback(
        async (token: string | null): Promise<Thread[]> => {
            if (!token) return [];
            try {
                // fetch and filter empty
                const fetchedThreads: Thread[] = (await fetchThreads(token)).filter((t: Thread) => t.messages.length > 0);
                const threadsObject = fetchedThreads.reduce((acc, thread) => {
                    // construct threads object, converting fetched data to object state
                    acc[
                        thread.thread_id
                            ? thread.thread_id.toString()
                            : thread.threadId
                                ? thread.threadId
                                : ""
                    ] = {
                        threadId: thread.thread_id
                            ? thread.thread_id
                            : thread.threadId
                                ? thread.threadId
                                : "",
                        ...thread,
                    };
                    return acc;
                }, {} as Threads);
                // mount threads state
                dispatchThreads({
                    type: "SET_THREADS",
                    payload: threadsObject,
                });

                setThreadCache(threadsObject);
                localStorage.setItem(
                    "cachedThreads",
                    JSON.stringify(threadsObject)
                );

                // ensure chronological sorting
                if (fetchedThreads.length > 0) {
                    const sortedThreads =
                        sortObjectsByCreatedAt(fetchedThreads);
                    // grab latest non empty thread
                    const latestThread =
                        sortedThreads[sortedThreads.length - 1];
                    // load last thread
                    dispatchThreads({
                        type: "SET_CURRENT_THREAD",
                        payload: latestThread.thread_id.toString(),
                    });
                }
                return fetchedThreads;

            } catch (error) {
                console.error("Error fetching threads:", error);
                throw error;
            }
        },
        []
    );

    /**
     * @method fetchData
     * @returns authenticatedUserObject: any
     */
    const fetchData = useCallback(async () => {
        try {
            if (!token) return;
            // once clerkAuth request completes the following executes
            const fetchedUserData = await fetchUser(token);
            console.log("fetchedUserData", fetchedUserData);
            setUser(fetchedUserData);
            clearNoteStorage(fetchedUserData);
            await getAgents(fetchedUserData).then(() => {
                console.log("agents fetched");
            });
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }, [token, getAgents]);

    const clearNoteStorage = (user: User) => {
        const noteId = localStorage.getItem("note user id");
        if (!user) {
            localStorage.setItem("notes", "");
            localStorage.setItem("note user id", "");
        } else if (noteId !== "") {
            if (noteId !== user.id) {
                localStorage.setItem("notes", "");
                localStorage.setItem("note user id", user.id ? user.id : "");
            }
        } else {
            localStorage.setItem("note user id", user.id ? user.id : "");
        }
    };

    /**
     * @method sendChat - http method for back and forth chatting with endpoint configured to match claude schema
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
        nameGiven?: string
    ) => {
        let name: string =
            user?.user?.first_name ?? nameGiven ?? "anonymousUser";
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
        console.log("newMsg", newMsg);
        dispatchThreads({
            type: "ADD_MESSAGE",
            payload: { threadId: currentThreadId, message: newMsg },
        });

        const updatedQueue = [...threadState.activeMessageQueue, newMsg].slice(
            -7
        );
        dispatchThreads({
            type: "SET_ACTIVE_MESSAGE_QUEUE",
            payload: { threadId: currentThreadId, messages: updatedQueue },
        });

        const messagesToSend = updatedQueue.map(msg => {
            let msgObj: any = {};
            if (typeof msg === "string") {
                msgObj = JSON.parse(msg)
            } else msgObj = msg;
            return {
                role: msgObj.msg.role,
                content: msgObj.msg.content,
            }
        });


        try {
            setIsLoading(true);
            setDisableQuery(true);
            if (token && user) {
                const response = search
                    ? await queryResearchModel(
                        {
                            user_id: user.user_id ?? 0,
                            question: message,
                            model: model || "claude-3-5-sonnet-20241022",
                            date: `${months[month + 1]} ${year}`,
                            max_turns: maxTurns,
                            actions_to_include: selectedActions,
                            additional_instructions: additionalInstructions,
                            example: example,
                            character: character,
                        },
                        token
                    )
                    : await queryModel(
                        {
                            // max_tokens: maxTokens ?? 8192,
                            max_tokens: 8192,
                            model: model || "claude-3-5-sonnet-20240620",
                            temperature: temperature ?? 0.6,
                            agent_id: agentId,
                            system_prompt: personalizePrompt(
                                prompts[agentId],
                                user.profile[0]
                            ),
                            messages: messagesToSend,
                            currentThreadId: currentThreadId,
                            user_id: user.user_id ?? 0,
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
                            response?.response ??
                            "If you're reading this, it means it didn't work. :(",
                    },
                };
                dispatchThreads({
                    type: "ADD_MESSAGE",
                    payload: {
                        threadId: currentThreadId,
                        message: receivedMsg,
                    },
                });
                setUpdateThread(true);
            }
        } catch (error) {
            console.error("Error sending chat:", error);
        } finally {
            setIsLoading(false);
            setDisableQuery(false);
        }
    };

    /**
     * @method switchThread
     * @param threadId
     * @returns void
     */
    const switchThread = (threadId: string) => {
        dispatchThreads({ type: "SET_CURRENT_THREAD", payload: threadId });
        localStorage.setItem("lastThreadId", threadId);
    };

    /**
     * @method createNewThread
     * @returns void
     */
    const createNewThread = async () => {
        const newThreadTitle: string = createTitle();
        const newThreadId: string = idGenerator.generate({
            timeComponent: 8,
            randomComponent: 10,
            addCounter: true,
        });

        try {
            if (user && user.user_id) {
                const newThread = (await saveNewThread(
                    newThreadId,
                    newThreadTitle,
                    user.user_id,
                    []
                ))[0] as Thread;
                dispatchThreads({
                    type: "ADD_THREAD",
                    payload: { threadId: newThreadId, thread: newThread },
                });
                dispatchThreads({
                    type: "SET_CURRENT_THREAD",
                    payload: newThreadId,
                });
                localStorage.setItem("lastThreadId", newThreadId);
            }
        } catch (error) {
            console.error("Error creating new thread:", error);
        }
    };

    const deleteThread = async (threadId: string) => {
        // TODO: Implement backend deletion
        dispatchThreads({ type: "DELETE_THREAD", payload: threadId });
    };

    const exportThread = (threadId: string): void => {
        const markdownContent = convertToMarkdown(
            threadState.threads[threadId]
        );
        const file = new Blob([markdownContent], {
            type: "text/plain",
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${threadState.threads[threadId].title}.txt`;
        link.click();
    };

    const addMessage = (threadId: string, message: MessageProps) => {
        dispatchThreads({
            type: "ADD_MESSAGE",
            payload: { threadId, message },
        });
    };

    return (
        <ChatContext.Provider
            value={{
                threadState,
                threadCache,
                agents,
                models,
                shouldQueryResearchModel,
                maxTurns,
                actionsToInclude,
                additionalInstructions,
                selectedActions,
                example,
                character,
                disableQuery,
                user,
                agentId,
                token,
                month,
                year,
                setToken,
                modelId,
                loadComplete,
                setUser,
                setModelId,
                setAgentId,
                setShouldQueryResearchModel,
                setMonth,
                setYear,
                setMaxTurns,
                setAdditionalInstructions,
                setSelectedActions,
                setExample,
                setCharacter,
                setDisableQuery,
                sendChat,
                switchThread,
                createNewThread,
                deleteThread,
                exportThread,
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

// const a = () => {}

// function a() {}

// const testObj = {
//     "user_id": "user_2fcYxEZjvkR9JSYcPCWFArsVy4p",
//     "question": "What are some fall women's fashion trends to look out for in NYC this fall?", "date": "November 2024",
//     "max_turns": 2,
//     "actions_to_include": ["wikipedia", "google"],
//     "additional_instructions": "Search either wikipedia or google to find information relevant to the question",
//     "model": "claude-3-5-sonnet-20241022",
//     "example": "",
//     "character": ""
// }
