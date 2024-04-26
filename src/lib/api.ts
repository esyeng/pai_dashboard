import { Thread } from "./types";
const BASE = "https://jasmyn-cb3idkum5a-uc.a.run.app";
const API_URL = `${BASE}/claude`;
// console.log(process.env.NODE_ENV === "production");
// console.log(process.env.API_URL);

interface ChatRequestParams {
	max_tokens: number;
	model: string;
	temperature: number;
	agent_id: string;
	messages: { role: string; content: string }[];
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

export const queryModel = async (
	params: ChatRequestParams
): Promise<ModelResponse> => {
	try {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
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

// check routing to ensure that the correct API URL is being used
export const fetchThreads = async (): Promise<Thread[]> => {
	try {
		const response = await fetch(`${BASE}/db/threads`);
		if (!response.ok) {
			throw new Error("Failed to fetch threads");
		}
		const data = await response.json();
		return data.threads;
	} catch (error) {
		console.error("Error fetching threads:", error);
		return [];
	}
};

// check routing to ensure that the correct API URL is being used
export const createThread = async (): Promise<Thread> => {
	try {
		const response = await fetch(`${BASE}/db/threads`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title: "New Thread" }), // Adjust the request body as needed
		});
		if (!response.ok) {
			throw new Error("Failed to create thread");
		}
		const data = await response.json();
		return data.thread;
	} catch (error) {
		console.error("Error creating thread:", error);
		return null;
	}
};

// check routing to ensure that the correct API URL is being used
export const exportThread = async (threadId: string): Promise<void> => {
	try {
		const response = await fetch(`${BASE}/db/threads/${threadId}/export`, {
			method: "POST",
		});
		if (!response.ok) {
			throw new Error("Failed to export thread");
		}
		// Handle the exported thread data (e.g., save to file)
	} catch (error) {
		console.error("Error exporting thread:", error);
	}
};
