const API_URL = 'http://localhost:5000/claude';

interface ChatRequestParams {
    max_tokens: number;
    model: string;
    temperature: number;
    agent_id: string;
    messages: { role: string; content: string }[];
}

interface ModelResponse {
    response?: any | {
        text?: string
        response?: string | JSON;
    }
    text?: string
}

export const queryModel = async (params: ChatRequestParams): Promise<ModelResponse> => {
    try {
        console.log("Queer query for the clear learny and worky bc I must make most of brain on earth time, yes.", JSON.stringify(params))
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error sending chat request:', error);
        throw error;
    }
};
