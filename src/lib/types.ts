// @lib/types.ts
import { Message } from "ai";

export type ServerActionResult<Result> = Promise<Result | { error: string }>;

export type Threads = Record<string, Thread>;

export interface Thread {
    [id: string | number]: {
        id: string | number;
        title?: string;
        createdAt: Date;
        userId?: string;
        path?: string;
        messages: MessageProps[] | any;
        sharePath?: string;
    };
}

export interface MessageProps {
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

export interface AgentProps {
    id: number;
    name: string;
    assistant_id: string;
    system_prompt: string;
    description?: string;
    user_ids?: string[];
}

export interface UserInfo {
    name: string;
    age?: number | string;
    nickname?: string;
    gender?: string;
    pronouns?: string;
}
// export interface MessageObject extends MessageProps {
//     id: number;
//     timestamp: string | number | Date;
//     sender: string;
// }

export interface Chat extends Record<string, any> {
    id: string;
    title: string;
    createdAt: Date;
    userId: string;
    path: string;
    messages: MessageProps[];
    sharePath?: string;
}

export interface Session {
    user: {
        id: string;
        email: string;
    };
}

export interface AuthResult {
    type: string;
    message: string;
}

export interface User extends Record<string, any> {
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

export interface OpenAIThread {
    id: string;
    object: "thread";
    created_at: number;
    metadata: Record<string, any>;
    messages: OpenAIMessage[];
}

export interface OpenAIMessage {
    id: string;
    object: "thread.message";
    created_at: number;
    thread_id: string;
    role: "assistant" | "user" | string;
    content: {
        type: string;
        text: {
            value: string;
            annotations: any[];
        };
    }[];
    assistant_id: string;
    run_id: string;
    attachments: any[];
    metadata: Record<string, any>;
}

export interface OpenAIRun {
    id: string;
    object: "thread.run";
    created_at: number;
    assistant_id: string;
    thread_id: string;
    status: "completed" | "pending" | "failed" | "cancelled";
    started_at: number;
    expires_at: number | null;
    cancelled_at: number | null;
    failed_at: number | null;
    completed_at: number | null;
    last_error: string | null;
    model: string;
    instructions: string | null;
    tools: { type: string }[];
    metadata: Record<string, any>;
    incomplete_details: string | null;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    temperature: number;
    top_p: number;
    max_prompt_tokens: number;
    max_completion_tokens: number;
    truncation_strategy: {
        type: string;
        last_messages: any | null;
    };
    response_format: string;
    tool_choice: string;
    parallel_tool_calls: boolean;
}

export interface OpenAIAssistant {
    id: string;
    object: "assistant";
    created_at: number;
    name: string;
    description: string | null;
    model: string;
    instructions: string | null;
    tools: { type: string }[];
    metadata: Record<string, any>;
    top_p: number;
    temperature: number;
    response_format: string;
}

// New request/response types for API interaction

export interface AssistantResponse
    extends ServerActionResult<OpenAIAssistant> { }
export interface AssistantsResponse
    extends ServerActionResult<OpenAIAssistant[]> { }

export interface CreateThreadResponse
    extends ServerActionResult<OpenAIThread> { }
export interface GetThreadResponse extends ServerActionResult<OpenAIThread> { }

export interface CreateMessageResponse
    extends ServerActionResult<OpenAIMessage> { }
export interface GetMessagesResponse
    extends ServerActionResult<OpenAIMessage[]> { }

export interface CreateRunResponse extends ServerActionResult<OpenAIRun> { }
export interface CreateAndRunResponse extends ServerActionResult<OpenAIRun> { }

export interface ListRunsResponse extends ServerActionResult<OpenAIRun[]> { }
export interface GetRunResponse extends ServerActionResult<OpenAIRun> { }

export interface CreateSpeechResponse
    extends ServerActionResult<{ speech_file_path: string }> { }
export interface CreateTranscriptionResponse
    extends ServerActionResult<{ transcript: string }> { }
export interface CreateImageResponse
    extends ServerActionResult<{ images: string[] }> { }

// Params types for API interaction

export interface CreateMessageParams {
    thread_id: string;
    message: string;
    attachments?: any[];
}

export interface CreateRunParams {
    thread_id: string;
    assistant_id: string;
    model?: string;
    instructions?: string;
    additional_instructions?: string;
    additional_messages?: OpenAIMessage[];
    stream?: boolean;
    max_prompt_tokens?: number;
    max_completion_tokens?: number;
}

export interface CreateAndRunParams {
    assistant_id: string;
    messages: OpenAIMessage[];
    model?: string;
    instructions?: string;
    stream?: boolean;
    max_prompt_tokens?: number;
    max_completion_tokens?: number;
}

export interface CreateSpeechParams {
    model: string;
    input: string;
    voice: string;
}

export interface CreateTranscriptionParams {
    file: string;
    language?: string;
    prompt?: string;
    response_format?: string;
}

export interface CreateImageParams {
    prompt: string;
    n: number;
    quality?: string;
    size?: string;
    style?: string;
}
