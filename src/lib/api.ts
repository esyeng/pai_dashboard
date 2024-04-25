const BASE = "https://jasmyn-cb3idkum5a-uc.a.run.app"
const API_URL = `${BASE}/claude`;
console.log(process.env.NODE_ENV === "production");
console.log(process.env.API_URL);

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
