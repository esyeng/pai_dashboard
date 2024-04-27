import { Thread, Threads } from "./types";
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

export const fetchUser = async () => {
    try {
        const response = await fetch(`${BASE}/db/auth/user`);
        if (!response.ok) {
            throw new Error("Failed to fetch user with session ID");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }

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
export const fetchThreads = async (): Promise<Threads> => {
	try {
		const response = await fetch(`${BASE}/db/threads`);
		if (!response.ok) {
			throw new Error("Failed to fetch threads");
		}
		const data = await response.json();
		return data.threads;
	} catch (error) {
		console.error("Error fetching threads:", error);
		return {};
	}
};

// check routing to ensure that the correct API URL is being used
export const createThread = async (): Promise<Thread | null> => {
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
// this function is not a backend call, it should take in a thread and export it to a downloadable file on the client
export const exportThread = (thread: Thread): void => {
    const markdownContent = convertToMarkdown(thread);
    const file = new Blob([markdownContent], {
        type: "text/markdown",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${thread.title}.md`;
    link.click();
};

const convertToMarkdown = (thread: Thread): string => {
    let markdown = `# ${thread.title}\n\n`;
    thread.messages.forEach((message) => {
        markdown += `**${message.senderName}:** ${message.content}\n\n`;
    });
    return markdown;
};

export const updateThreadName = async ( threadId: string, title: string): Promise<void> => {
    try {
        const response = await fetch(`${BASE}/db/threads/${threadId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
        });
        if (!response.ok) {
            throw new Error("Failed to update thread name");
        }
    } catch (error) {
        console.error("Error updating thread name:", error);
    }
}
