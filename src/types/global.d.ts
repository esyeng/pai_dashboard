export { };

declare global {
    interface MessageProps {
        id: string | number;
        timestamp: string | number | Date;
        sender: string;
        msg: {
            role: string;
            content: string;
        };
        agentId: string;
        stream?: boolean;
        language?: string;
    }

    interface AgentProps {
        id: number;
        name: string;
        assistant_id: string;
        system_prompt: string;
        description?: string;
    }

    interface UserInfo {
        name: string;
        age?: number | string;
        nickname?: string;
        gender?: string;
        pronouns?: string;
    }

    interface User extends Record<string, any> {
        id?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        gender?: string;
        pronouns?: string;
        nickname?: string;
        threads?: any;
        assistantIds?: string[];
        modelIds?: string[];
        notes?: any;
    }

    interface Chat extends Record<string, any> {
        id: string;
        title: string;
        createdAt: Date;
        userId: string;
        messages: MessageProps[];
    }

    interface Thread {
        id: number;
        threadId?: string;
        title: string;
        createdAt: Date;
        userId: string;
        messages: MessageProps[];
        thread_id?: string;
    }

    type Threads = Record<string, Thread>;

    interface ThreadsState {
        threads: Threads;
        currentThreadId: string | null;
        activeMessageQueue: MessageProps[];
        messagesInActiveThread: MessageProps[];
    }

    type ThreadsAction =
        | { type: 'SET_THREADS'; payload: Threads }
        | { type: 'ADD_THREAD'; payload: { threadId: string; thread: Thread } }
        | { type: 'UPDATE_THREAD'; payload: { threadId: string; updates: Partial<Thread> } }
        | { type: 'DELETE_THREAD'; payload: string }
        | { type: 'ADD_MESSAGE'; payload: { threadId: string; message: MessageProps } }
        | { type: 'SET_CURRENT_THREAD'; payload: string }
        | { type: 'SET_ACTIVE_MESSAGE_QUEUE'; payload: { threadId: string; messages: MessageProps[] } }
        | { type: 'SET_MESSAGES_IN_ACTIVE_THREAD'; payload: { threadId: string; messages: MessageProps[] } };


    // Directory of state and functions for the chat context
    interface ChatContextType {
        threadState: ThreadsState;
        threadCache: Threads;
        shouldQueryResearchModel: boolean;
        maxTurns: number;
        actionsToInclude: string[];
        additionalInstructions: string;
        example: string;
        character: string;
        month: number;
        year: number;
        selectedActions: string[];
        disableQuery: boolean;
        setShouldQueryResearchModel: (shouldQuery: boolean) => void;
        setMaxTurns: (maxTurns: number) => void;
        setAdditionalInstructions: (instructions: string) => void;
        setSelectedActions: (actions: string[]) => void;
        setExample: (example: string) => void;
        setCharacter: (character: string) => void;
        setMonth: (month: number) => void;
        setYear: (year: number) => void;
        setDisableQuery: (disableQuery: boolean) => void
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
        fetchThreadsData: (user_id: string) => Promise<Thread[]>;
        isLoading?: boolean;
    }

    interface AssistantContextType {
        status: 'idle' | 'loading' | 'success' | 'error' | 'info';
        statusMessage: string;
        agents: AgentProps[];
        models: any;
        prompts: PromptMap
        agentId: string;
        modelId: string;
        provider: string;
        claudeModels: string[];
        veniceModels: string[];
        setStatusMessage: (msg: str) => void;
        getAgents: (user: UserResponse | User) => Promise<any>;
        setModelId: (modelId: string) => void;
        setAgentId: (agentId: string) => void;
        setProvider: (provider: "claude" | "venice") => void;
        createNewAssistant: (
            user_id: string,
            assistant_id: string,
            name: string,
            system_prompt: string,
            description?: string
        ) => Promise<any>;
        saveAssistantUpdates: (
            user_id: string,
            assistant_id: string,
            name: string,
            system_prompt: string,
            description: string
        ) => Promise<any>;
    }

    interface AuthContextType {
        user: User | UserResponse | null;
        token: string;
        latestToken: string;
        loadComplete: boolean;
        setToken: (token: string | Promise<string> | any) => void;
        setLatestToken: (token: string | Promise<string> | any) => void;
        setUser: (user: User | UserResponse) => void;
    }

    interface DataObject {
        createdAt: string;
        [key: string]: any;
    }

    interface ClaudeResearchRequestParams {
        user_id: string;
        model: string;
        question: string;
        date: string;
        max_turns: number;
        actions_to_include: string[];
        additional_instructions: string;
        example: string;
        character: string;
    }

    interface ClaudeChatRequestParams {
        max_tokens: number;
        model: string;
        temperature: number;
        agent_id: string;
        system_prompt: string;
        messages: { role: string; content: string }[];
        currentThreadId: string | number;
        user_id: string | 0;
    }

    interface OpenAIToolParams {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                type: string;
                properties: {
                    [string]: {
                        type: string;
                        description: string;
                    }
                }
                required: string[];
                additionalProperties: boolean;
            }
        }
    }

    interface ToolResponse {
        id: string;
        object: string;
        created: number;
        model: string;
        choices: [
            {
                index: number;
                message: {
                    role: string,
                    content: null,
                    tool_calls: [
                        {
                            id: string;
                            type: string;
                            function: {
                                name: string;
                                arguments: string;
                            }
                        }
                    ]
                }
                logprobs: any;
                finish_reason: string;
            }
        ];
        usage: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
            completion_tokens_details: {
                reasoning_tokens: number;
                accepted_prediction_tokens: number;
                rejected_prediction_tokens: number;
            }
        }
    }

    interface VeniceChatRequestParams {
        max_tokens: number
        temperature: number;
        model: string;
        system_prompt: string;
        messages: any[];
        use_venice: boolean;
        tools: OpenAIToolParams[];
    }

    interface ModelResponse {
        response?:
        | any
        | {
            text?: string;
            response?: string | JSON;
        };
        choices?: [{ stop_reason: string; message: { role: string; content: string; } }]
        text?: string;
    }

    interface UserResponse {
        session_id: string;
        user: User;
        user_id: string;
        profile: any;
    }

    interface PromptMap {
        [key: string]: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
        };
    }

    interface AuthResult {
        type: string;
        message: string;
    }

    // Add Clerk to Window to avoid type errors
    interface Window {
        Clerk: any;
    }
}



