import { useAuth } from "@/contexts/AuthContext";
import { safeJSONParse } from "../utils";
import dotenv from "dotenv";

dotenv.config();

const BASE = process.env.BASE_URL
    ? process.env.BASE_URL
    : "https://jasmyn-dev-418676732313.us-central1.run.app";

// const GPT_BASE = `${BASE}/model/gpt`;
const CLAUDE = `${BASE}/model/claude`;

export function useApi() {
    const { supabaseClient, getLatestToken } = useAuth();

    // ******* CLAUDE ********
    // TODO - allow for different models

    const queryModel = async (
        params: ClaudeChatRequestParams
    ): Promise<ModelResponse> => {
        try {
            const token = await getLatestToken();
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
    const queryResearchModel = async (
        params: ClaudeResearchRequestParams
    ): Promise<ModelResponse> => {
        try {
            const token = await getLatestToken();
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
    };

    const fetchUser = async (token: any) => {
        try {

            if (typeof token === 'object') {
                // console.log("token is object", token);
                token = await token;
            }
            token = await token;
            // console.log("fetching user with session ID", token);
            console.log("type of token", typeof token);
            const response = await fetch(`${BASE}/auth/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(token),
            });
            const responseObj: UserResponse =
                (await response.json()) as UserResponse;
            // console.log("response json", response.json());
            if (responseObj.user_id === undefined) {
                throw new Error("Failed to fetch user with session ID");
            }
            if (supabaseClient === null) {
                throw new Error("User: Supabase client is null");
            }
            let data;
            if (token && supabaseClient) {
                data = await supabaseClient
                .from("users")
                .select()
                .eq("user_id", responseObj.user_id)
                .then((data) => {
                    console.log("data", data);
                    if (data.error) {
                        throw new Error(
                            "Failed to fetch user with session ID" +
                            data.error?.message
                        );
                    }
                    return {
                        ...responseObj,
                        profile: data.data[0],
                    } as UserResponse;
                })
            }
            return data as UserResponse;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    };

    const fetchThreads = async (): Promise<Thread[]> => {
        try {
            // const token = await getLatestToken();
            const { data, error } = await supabaseClient
                .from("threads")
                .select("*");
            if (error) {
                throw new Error("Failed to fetch threads" + error?.message);
            }
            return data as Thread[];


        } catch (error) {
            console.error("Error fetching threads:", error);
            throw error;
        }
    };

    const fetchAssistants = async (assistantIds: string[]): Promise<any> => {
        try {
            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from("assistants")
                    .select("*")
                    .in("assistant_id", assistantIds);
                if (error) {
                    throw new Error("Failed to fetch assistants" + error?.message);
                }
                return data;
            }
        } catch (error) {
            console.error("Error fetching assistants:", error);
            throw error;
        }
    };

    const fetchModels = async (): Promise<any> => {
        try {
            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from("models")
                    .select("*");
                if (error) {
                    throw new Error("Failed to fetch models");
                }
                return data;
            }
        } catch (error) {
            console.error("Error fetching models:", error);
            throw error;
        }
    };

    const saveNewThread = async (
        thread_id: string,
        title: string,
        userId: string,
        messages: string[]
    ): Promise<any> => {
        console.log(
            "saving new thread (thread id, title, user id, last message)",
            thread_id,
            title,
            userId,
            messages[messages.length - 1]
        );
        try {
            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from("threads")
                    .insert([
                        {
                            thread_id: thread_id,
                            title: title,
                            user_id: userId,
                            messages: messages,
                        },
                    ])
                    .select();
                if (error) {
                    throw new Error("Failed to create thread" + error?.message);
                }
                return data;
            }
        } catch (error) {
            console.error("Error creating thread:", error);
            return error;
        }
    };

    const updateThreadMessages = async (
        id: number,
        messages: any[]
    ): Promise<any> => {
        try {
            if (supabaseClient) {

                const { data, error } = await supabaseClient
                    .from("threads")
                    .update({
                        messages: messages.map(msg =>
                            safeJSONParse<MessageProps>(msg)
                        ),
                    })
                    .eq("id", id)
                    .select();
                if (error) {
                    console.log("error from thing", error);
                    throw new Error("Failed to update thread messages");
                }
                if (data) console.log("success updated thread messages!", data);
                return data;
            }
            // console.log("last message to update", messages[messages.length - 1])
        } catch (error) {
            console.error("Error updating thread messages:", error);
            return error;
        }
    };

    return {
        queryModel,
        queryResearchModel,
        fetchUser,
        fetchThreads,
        fetchAssistants,
        fetchModels,
        saveNewThread,
        updateThreadMessages,
    };
}
