import {
	Thread,
	Threads,
	MessageProps,
	OpenAIAssistant,
	OpenAIMessage,
	OpenAIRun,
	OpenAIThread,
	AssistantResponse,
	AssistantsResponse,
	CreateAndRunParams,
	CreateAndRunResponse,
	CreateImageParams,
	CreateImageResponse,
	CreateMessageParams,
	CreateMessageResponse,
	CreateRunParams,
	CreateRunResponse,
	CreateSpeechParams,
	CreateSpeechResponse,
	CreateThreadResponse,
	CreateTranscriptionParams,
	CreateTranscriptionResponse,
	GetMessagesResponse,
	GetRunResponse,
	GetThreadResponse,
	ListRunsResponse,
} from "./types";
import { createClerkSupabaseClient } from "../app/supabase/client";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.BASE_URL
  ? process.env.BASE_URL
  : "https://jasmyn-app-cb3idkum5a-uc.a.run.app";


const GPT_BASE = `${BASE}/model/gpt`;
// const CLAUDE_CHAT = `${BASE}/claude`;
const CLAUDE_CHAT = `${BASE}/model/claude/chat`;


interface ClaudeChatRequestParams {
	max_tokens: number;
	model: string;
	temperature: number;
	agent_id: string;
	messages: { role: string; content: string }[];
	currentThreadId: string | number;
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

export function parseMessageString(messageString: string): MessageProps {
	let parsedMessage = JSON.parse(messageString);
	// console.log(
	// 	messageString
	// );

	if (typeof parsedMessage === "string") {
		parsedMessage = JSON.parse(parsedMessage);
	}

	if (typeof parsedMessage === "string") {
		parsedMessage = JSON.parse(parsedMessage);
	}

	if (typeof parsedMessage === "string") {
		parsedMessage = JSON.parse(parsedMessage);
	}
	// console.log(
		// typeof parsedMessage
	// );
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

export const queryModel = async (
	params: ClaudeChatRequestParams,
	token: string
): Promise<ModelResponse> => {
	try {
		const response = await fetch(`${CLAUDE_CHAT}`, {
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

export const fetchUser = async (token: any) => {
	try {
		// console.log("token from fetchUser", token);
		const response = await fetch(`${BASE}/auth/user`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify(token),
		});
		if (!response.ok) {
			throw new Error("Failed to fetch user with session ID");
		}
		return response.json();
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
};

export const fetchThreads = async (
	token: string | Promise<string>
): Promise<Thread[]> => {
	const client = createClerkSupabaseClient();
	try {
		const { data, error } = await client.from("threads").select("*");
		if (error) {
			throw new Error("Failed to fetch threads");
		}
		return data as Thread[];
	} catch (error) {
		console.error("Error fetching threads:", error);
		throw error;
	}
};

export const saveNewThread = async (
	thread_id: string,
	title: string,
	userId: string,
	messages: string[]
) => {
	const client = createClerkSupabaseClient();
	console.log("saving new thread", thread_id, title, userId, messages);
	try {
		const { data, error } = await client.from("threads").insert([
			{
				title: title,
				thread_id: thread_id,
				user_id: userId,
				messages: messages,
			},
		]);
		if (error) {
			throw new Error("Failed to create thread");
		}
		return data;
	} catch (error) {
		console.error("Error creating thread:", error);
		return error;
	}
};

export const updateThreadName = async (threadId: string, title: string) => {
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
	threadId: string | number,
	messages: any[]
) => {
	const client = createClerkSupabaseClient();
	console.log("updating thread messages", threadId, messages);
	try {
		const { data, error } = await client
			.from("threads")
			.update({
				messages: messages.map((msg) =>
					typeof msg === "string" ? msg : JSON.stringify(msg)
				),
			})
			.match({ thread_id: threadId });
		if (error) {
			console.log("error from thing", error);
			throw new Error("Failed to update thread messages");
		}
		if (data) console.log("updated thread messages!", data);
		return data;
	} catch (error) {
		console.error("Error updating thread messages:", error);
		return error;
	}
};

// OPENAI METHODS:
// api.ts

// Functions to interact with FastAPI endpoints

export const getAssistant = async (
	assistant_id: string,
	token: string
): Promise<AssistantResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/assistant/${assistant_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				Authorization: "Bearer " + token,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching assistant:", error);
		throw error;
	}
};

export const getAllAssistants = async (
	token: string
): Promise<AssistantsResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/assistants`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				Authorization: "Bearer " + token,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching assistants:", error);
		throw error;
	}
};

export const createThread = async (
	token: string
): Promise<CreateThreadResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/thread`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				Authorization: "Bearer " + token,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error creating thread:", error);
		throw error;
	}
};

export const getThread = async (
	thread_id: string,
	token: string
): Promise<GetThreadResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/thread/${thread_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				Authorization: "Bearer " + token,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching thread:", error);
		throw error;
	}
};

export const createMessage = async (
	params: CreateMessageParams,
	token: string
): Promise<CreateMessageResponse> => {
	try {
		const response = await fetch(
			`${GPT_BASE}/thread/${params.thread_id}/message`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify(params),
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error creating message:", error);
		throw error;
	}
};

export const getMessages = async (
	thread_id: string,
	token: string
): Promise<GetMessagesResponse> => {
	try {
		const response = await fetch(
			`${GPT_BASE}/thread/${thread_id}/messages`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: "Bearer " + token,
				},
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching messages:", error);
		throw error;
	}
};

export const getMessage = async (
	thread_id: string,
	message_id: string,
	token: string
): Promise<GetMessagesResponse> => {
	try {
		const response = await fetch(
			`${GPT_BASE}/thread/${thread_id}/message/${message_id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: "Bearer " + token,
				},
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching message:", error);
		throw error;
	}
};

export const createRun = async (
	params: CreateRunParams,
	token: string
): Promise<CreateRunResponse> => {
	try {
		const response = await fetch(
			`${GPT_BASE}/thread/${params.thread_id}/run`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify(params),
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error creating run:", error);
		throw error;
	}
};

export const createAndRun = async (
	params: CreateAndRunParams,
	token: string
): Promise<CreateAndRunResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/run`, {
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
		console.error("Error creating and running:", error);
		throw error;
	}
};

export const listRuns = async (
	thread_id: string,
	token: string
): Promise<ListRunsResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/thread/${thread_id}/runs`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				Authorization: "Bearer " + token,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error listing runs:", error);
		throw error;
	}
};

export const getRun = async (
	thread_id: string,
	run_id: string,
	token: string
): Promise<GetRunResponse> => {
	try {
		const response = await fetch(
			`${GPT_BASE}/thread/${thread_id}/run/${run_id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					Authorization: "Bearer " + token,
				},
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching run:", error);
		throw error;
	}
};

export const createSpeech = async (
	params: CreateSpeechParams,
	token: string
): Promise<CreateSpeechResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/speech`, {
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
		console.error("Error creating speech:", error);
		throw error;
	}
};

export const createTranscription = async (
	params: CreateTranscriptionParams,
	token: string
): Promise<CreateTranscriptionResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/transcription`, {
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
		console.error("Error creating transcription:", error);
		throw error;
	}
};

export const createImage = async (
	params: CreateImageParams,
	token: string
): Promise<CreateImageResponse> => {
	try {
		const response = await fetch(`${GPT_BASE}/image`, {
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
		console.error("Error creating image:", error);
		throw error;
	}
};
