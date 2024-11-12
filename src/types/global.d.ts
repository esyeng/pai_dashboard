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
        user_ids?: string[];
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
        [id: string | number]: {
            id: number;
            threadId: string;
            title: string;
            createdAt: Date;
            userId: string;
            messages: MessageProps[] | any[];
        };
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
        agents: any;
        models: any;
        user: User | null;
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
        fetchThreadsData: (token: string | null) => Promise<Thread[]>;
        isLoading?: boolean;
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

    interface ModelResponse {
        response?:
        | any
        | {
            text?: string;
            response?: string | JSON;
        };
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
