import { Thread, Threads, MessageProps } from "./types";
import { createClerkSupabaseClient } from "../app/supabase/client";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.BASE_URL? process.env.BASE_URL : "http://localhost:8080";

const CLAUDE_CHAT = `${BASE}/model/claude/chat`;
// console.log(process.env.NODE_ENV === "production");
// console.log(process.env.CLAUDE_CHAT);

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
	console.log(
		"FUCKING INPUT TO FUCKING PARSE STRING FUCKTION",
		messageString
	);

	if (typeof parsedMessage === "string") {
		parsedMessage = JSON.parse(parsedMessage);
	}

	if (typeof parsedMessage === "string") {
		parsedMessage = JSON.parse(parsedMessage);
	}

	if (typeof parsedMessage === "string") {
		parsedMessage = JSON.parse(parsedMessage);
	}

	console.log("FUCKING PARSED STRING FUCK YOU", parsedMessage);
	console.log(
		"FUCKING TYPE OF THE PARSED STRING FUCK YOU",
		typeof parsedMessage
	);
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
		console.log("token from fetchUser", token);
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
