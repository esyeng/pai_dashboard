
import { createClerkSupabaseClient } from "../app/supabase/client";
import dotenv from "dotenv";
import { safeJSONParse } from "./utils";

dotenv.config();

const BASE = process.env.BASE_URL
    ? process.env.BASE_URL
    : "https://jasmyn-dev-418676732313.us-central1.run.app";



// const GPT_BASE = `${BASE}/model/gpt`;
const CLAUDE = `${BASE}/model/claude`;


export function parseMessageString(messageString: string): MessageProps {
    let parsedMessage = JSON.parse(messageString);

    if (typeof parsedMessage === "string") {
        parsedMessage = JSON.parse(parsedMessage);
    }

    if (typeof parsedMessage === "string") {
        parsedMessage = JSON.parse(parsedMessage);
    }

    if (typeof parsedMessage === "string") {
        parsedMessage = JSON.parse(parsedMessage);
    }
    const message: MessageProps = {
        id: parsedMessage.id,
        timestamp: parsedMessage.timestamp,
        sender: parsedMessage.sender,
        msg: {
            role: parsedMessage.msg.role,
            content: parsedMessage.msg.content,
        },
        agentId: parsedMessage.agent_id,
        stream: parsedMessage.stream ? true : false,
        language: parsedMessage.language ? parsedMessage.language : "en",
    };

    return message;
}

// ******* CLAUDE ********
// TODO - allow for different models

export const queryModel = async (
    params: ClaudeChatRequestParams,
    token: any
): Promise<ModelResponse> => {
    try {
        if (typeof token === "object") {
            token = await token;
        }
        const response = await fetch(`${CLAUDE}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sending chat request:", error);
        throw error;
    }
};


/**
 *
 * queryResearchModel - queries the ReAct ChatBot
 *
 * example request body:
 * {
    "user_id": "...",
    "question": "What are some fall women's fashion trends to look out for in NYC this fall?",
    "date": "November 2024",
    "max_turns": 5,
    "actions_to_include": ["wikipedia", "google"],
    "additional_instructions": "Search either wikipedia or google to find information relevant to the question",
    "example": "",
    "character": "You are ..."
}
 */

export const queryResearchModel = async (
    params: ClaudeResearchRequestParams,
    token: any
): Promise<ModelResponse> => {
    try {
        if (typeof token === "object") {
            token = await token;
        }
        const response = await fetch(`${CLAUDE}/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sending research request:", error);
        throw error;
    }
}



export const fetchUser = async (token: any) => {
    const client = createClerkSupabaseClient();
    try {
        if (typeof token === "object") {
            token = await token;
        }
        console.log("fetching user with session ID", token);
        console.log("type of token", typeof token);
        const response = await fetch(`${BASE}/auth/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(token),
        });
        const responseObj: UserResponse = await response.json() as UserResponse;
        // console.log("response json", response.json());
        if (responseObj.user_id === undefined) {
            throw new Error("Failed to fetch user with session ID")
        }
        return await client.from("users").select().eq('user_id', responseObj.user_id)
            .then((data) => {
                console.log("data", data);
                if (data.error) {
                    throw new Error("Failed to fetch user with session ID" + data.error?.message);
                }
                return {
                    ...responseObj,
                    profile: data.data[0]
                } as UserResponse;
            }) as UserResponse;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export const fetchThreads = async (
    token: string | Promise<string>
): Promise<Thread[]> => {
    const client = createClerkSupabaseClient();
    try {
        const { data, error } = await client.from("threads").select("*");
        if (error) {
            throw new Error("Failed to fetch threads" + error?.message);
        }
        return data as Thread[];
    } catch (error) {
        console.error("Error fetching threads:", error);
        throw error;
    }
};

export const fetchAssistants = async (assistantIds: string[]): Promise<any> => {
    const client = createClerkSupabaseClient();
    try {
        const { data, error } = await
            client
                .from("assistants")
                .select("*")
                .in("assistant_id", assistantIds);
        if (error) {
            throw new Error("Failed to fetch assistants" + error?.message);
        }
        return data;
    } catch (error) {
        console.error("Error fetching assistants:", error);
        throw error;
    }
}

export const fetchModels = async (): Promise<any> => {
    const client = createClerkSupabaseClient();
    try {
        const { data, error } = await client.from("models").select("*");
        if (error) {
            throw new Error("Failed to fetch models");
        }
        return data;
    } catch (error) {
        console.error("Error fetching models:", error);
        throw error;
    }
}

export const saveNewThread = async (
    thread_id: string,
    title: string,
    userId: string,
    messages: string[]
): Promise<any> => {
    const client = createClerkSupabaseClient();
    console.log("saving new thread (thread id, title, user id, last message)", thread_id, title, userId, messages[messages.length - 1]);
    try {
        const { data, error } = await client.from("threads").insert([
            {
                thread_id: thread_id,
                title: title,
                user_id: userId,
                messages: messages,
            },
        ]).select();
        if (error) {
            throw new Error("Failed to create thread" + error?.message);
        }
        return data;
    } catch (error) {
        console.error("Error creating thread:", error);
        return error;
    }
};

export const updateThreadName = async (threadId: string, title: string) => {
    // TODO - update to reflect latest supabase client changes
    const client = createClerkSupabaseClient();
    try {
        const { data, error } = await client
            .from("threads")
            .update({ title: title })
            .match({ thread_id: threadId });
        if (error) {
            throw new Error("Failed to update thread name");
        }
        return data;
    } catch (error) {
        console.error("Error updating thread name:", error);
        return error;
    }
};

export const updateThreadMessages = async (
    id: number,
    messages: any[]
): Promise<any> => {
    const client = createClerkSupabaseClient();
    try {
        // console.log("last message to update", messages[messages.length - 1])
        const { data, error } = await client
            .from("threads")
            .update({
                messages: messages.map((msg) => safeJSONParse<MessageProps>(msg)),
            })
            .eq('id', id)
            .select();
        if (error) {
            console.log("error from thing", error);
            throw new Error("Failed to update thread messages");
        }
        if (data) console.log("success updated thread messages!", data);
        return data;
    } catch (error) {
        console.error("Error updating thread messages:", error);
        return error;
    }
};
