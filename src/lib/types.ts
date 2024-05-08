// @lib/types.ts
import { Message } from "ai";

export type ServerActionResult<Result> = Promise<
    Result | { error: string }
>;

export type Threads = Record<string, Thread>;


export interface Thread {
    id: string;
    title?: string;
    createdAt: Date;
    userId?: string;
    path?: string;
    messages: MessageProps[];
    sharePath?: string;
}

export interface MessageProps {
    id: string | number;
    timestamp: string | number | Date;
    sender: string;
    msg: {
        role: string;
        content: string;
    }
    agentId: string;
    stream?: boolean;
    language?: string;
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
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    gender?: string;
    pronouns?: string;
    nickname?: string;
    threads?: any;
    agents?: any;
    notes?: any;
}
