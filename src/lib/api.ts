const API_URL = 'http://localhost:8000/api/chat';

interface ChatRequestParams {
    max_tokens: number;
    model: string;
    temperature: number;
    agent_id: string;
    messages: { role: string; content: string }[];
}

export const queryModel = async (params: ChatRequestParams): Promise<{ response: string }> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending chat request:', error);
        throw error;
    }
};
