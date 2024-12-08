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
    saveNewThread,
    updateThreadMessages,
    deleteThread
} from "../lib/api";
import {
    UniqueIdGenerator,
    convertToMarkdown,
    createTitle,
    personalizePrompt,
    sortObjectsByCreatedAt,
} from "@/lib/utils/helpers";
import { threadsReducer } from "./threadsReducer";
import { useJasmynAuth } from "./AuthContext";
import { useAssistants } from "./AssistantContext";
import { useSearch } from "./SearchContext";
import { v4 as uuidv4 } from "uuid";

/**
 * ChatContext.tsx
 */


interface ChatProviderProps {
    children: React.ReactNode;
}

const STORED_THREAD_ID: string = "latest_thread_id";

// Unique ID for each thread, used for selecting and updating. Is separate from db object thread.id
const idGenerator = UniqueIdGenerator.getInstance();

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    let storedThreadId: string | null;
    if (typeof localStorage !== "undefined" && localStorage !== null) {
        storedThreadId = localStorage.getItem(STORED_THREAD_ID);
    }
    const [threadState, dispatchThreads] = useReducer(threadsReducer, {
        threads: {},
        currentThreadId: null,
        activeMessageQueue: [],
        messagesInActiveThread: [],
    });
    const { user, latestToken, loadComplete } = useJasmynAuth();
    const { provider, prompts, status, statusMessage, setStatus, setStatusMessage } = useAssistants();
    const {
        setDisableQuery,
        maxTurns,
        selectedActions,
        additionalInstructions,
        example,
        character,
        month,
        year,
        months
    } = useSearch();
    const [threadCache, setThreadCache] = useState<Threads>({});

    // Status flags
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // flag for updating database thread messages
    const [updateThread, setUpdateThread] = useState<boolean>(false);

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

    // sets name as editable
    const setEditable = (thread: Thread) => {
        const id = thread.thread_id ?? thread.threadId;
        if (id) {
            dispatchThreads({
                type: "UPDATE_THREAD",
                payload: {
                    threadId: id,
                    updates: { name_editable: true }
                }
            })
        }
    }

    // enable send on load complete
    useEffect(() => {
        if (loadComplete) {
            setDisableQuery(false);
        }
    }, [loadComplete]);

    // save thread messages after each msg
    useEffect(() => {
        if (!updateThread) return
        if (threadState.currentThreadId && threadState.threads[threadState.currentThreadId].messages) {
            console.log("updating thread messages");
            const currentThread = threadState.threads[threadState.currentThreadId]
            updateThreadSavedMessages(currentThread.id, currentThread.messages);
            if (currentThread.messages.length >= 2) {
                setEditable(currentThread);
            }
            setUpdateThread(false);
        }
    }, [updateThread]);

    // ******  chat & threads methods ********
    /**
     * @method fetchThreadsData
     * @param user_id: string
     * @returns fetchedThreads: Thread[]
     */
    const fetchThreadsData = useCallback(
        async (user_id: string): Promise<Thread[]> => {
            try {
                // fetch and filter empty
                const fetchedThreads: Thread[] = (await fetchThreads(user_id)).filter((t: Thread) => t.messages.length > 0);
                const threadsObject = fetchedThreads.reduce((acc, thread) => {
                    // if the Thread is at least 2 messages long, add flag to allow name edits
                    if (thread.messages.length >= 2) {
                        thread.name_editable = true;
                    } else {
                        thread.name_editable = false;
                    }
                    // construct threads object, converting fetched data to object state
                    // from Thread[] to Record object -> { [x: string]: Thread }
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

                // cache for current user agent
                // TODO -> handle clean on logout
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
                        sortedThreads[0];
                    // load last thread
                    dispatchThreads({
                        type: "SET_CURRENT_THREAD",
                        payload: storedThreadId ?? latestThread.thread_id.toString(),
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
     * @method sendChat - http method for back and forth chatting with provider endpoint
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
        useVenice?: boolean
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
        addMessage(currentThreadId, newMsg);

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
            if (latestToken && user) {
                let prof;
                if (Array.isArray(user.profile)) { // temp fix for diff response format of diff providers, should be standardized
                    prof = user.profile[0];
                } else prof = user.profile;
                const sys = personalizePrompt(
                    prompts[agentId],
                    prof
                );
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
                        latestToken
                    )
                    : await queryModel(provider,
                        {
                            max_tokens: maxTokens ?? 8192,
                            model: model || "claude-3-5-sonnet-20240620",
                            temperature: temperature ?? 0.6,
                            agent_id: agentId,
                            system_prompt: sys,
                            messages: messagesToSend,
                            use_venice: useVenice ?? true,
                            currentThreadId: currentThreadId,
                            user_id: user.user_id ?? 0,
                        },
                        latestToken
                    );
                console.log("received resp", response?.response?.length);
                const receivedMsg: MessageProps = {
                    id: uuidv4(),
                    timestamp: Date.now(),
                    agentId: agentId,
                    sender: agentId,
                    msg: {
                        role: "assistant",
                        content: provider === "claude" ?
                            response?.response : response?.choices?.[0]?.message?.content ??
                            "If you're reading this, it means it didn't work. :(",
                    },
                };
                addMessage(currentThreadId, receivedMsg);
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
        localStorage.setItem(STORED_THREAD_ID, threadId);
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
                localStorage.setItem(STORED_THREAD_ID, newThreadId);
            }
        } catch (error) {
            console.error("Error creating new thread:", error);
        }
    };

    const runDeleteThread = async (id: number, threadId: string) => {
        // TODO: Implement backend deletion
        setStatus("loading");
        setStatusMessage(`deleting thread ${id}`);
        try {
            const deletedThread = await deleteThread(id);
            if (deletedThread) {
                dispatchThreads({ type: "DELETE_THREAD", payload: threadId });
                setStatus("success");
                setStatusMessage(`Thread ${id} ${threadId} deleted successfully`)
                return null;
            } else {
                throw new Error("Failed to delete thread");
            }
        } catch (error) {
            setStatus('error');
            setStatusMessage(`Failed to delete thread: ${error}`);
            console.error("Error deleting thread:", error);
            return null;
        }
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
                sendChat,
                dispatchThreads,
                switchThread,
                createNewThread,
                runDeleteThread,
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
