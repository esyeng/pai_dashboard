import React, { createContext, useState, useContext, useEffect } from "react";
import {
    fetchAssistants,
    fetchModels,
    createAssistant,
    updateAssistant
} from "../lib/api";
import { useJasmynAuth } from "./AuthContext";

/**
 * AssistantContext.tsx
 */

interface AssistantProviderProps {
    children: React.ReactNode;
}

const STORED_MODEL_ID: string = "model_id";
const STORED_AGENT_ID: string = "agent_id";
const STORED_PROVIDER_ID: string = "provider_id";

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider: React.FC<AssistantProviderProps> = ({ children }) => {
    let storedAgent: any, storedModel: any, storedProvider: any;
    if (typeof localStorage !== "undefined") {
        storedAgent = localStorage?.getItem(STORED_AGENT_ID);
        storedModel = localStorage?.getItem(STORED_MODEL_ID);
        storedProvider = localStorage?.getItem(STORED_PROVIDER_ID);
    }

    // Default agent, model
    const [agentId, setAgentId] = useState<string>(storedAgent ? storedAgent : "jasmyn");
    const [modelId, setModelId] = useState<string>(storedModel ? storedModel : "dolphin-2.9.2-qwen2-72b");
    const [provider, setProvider] = useState<string>(storedProvider ? storedProvider : "venice");

    const [agents, setAgents] = useState<AgentProps[]>([]);
    const [models, setModels] = useState<any>([]);
    // prompts is an object used to combine user details with character prompt for personalized chat messages
    const [prompts, setPrompts] = useState<PromptMap>({});
    const claudeModels = ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"]
    const veniceModels = ["llama-3.1-405b", "llama-3.2-3b", "dolphin-2.9.2-qwen2-72b", "nous-theta-8b", "qwen32b"]


    useEffect(() => {
        if (typeof storedModel === 'string') {
            setModelId(storedModel);
        }
        if (typeof storedAgent === 'string') {
            setAgentId(storedAgent);
        }
        if (typeof storedProvider === 'string') {
            setProvider(storedProvider);
        }
    }, [])

    // fetch agents from db once user data present
    const getAgents = async (user: UserResponse | User) => {
        console.log("get agents called");
        console.log("user object in getAgents", user);
        if (!user || !user.profile) {
            console.log("no user object in getAgents");
            return;
        }
        const agents = await fetchAssistants(user.user_id);
        const models = await fetchModels();
        const promptMap: PromptMap = {};
        if (agents) {
            console.log("agents is true", user);
            setAgents(agents);
            console.log("Agents!", agents);
            agents.forEach((agent: AgentProps) => {
                promptMap[agent.assistant_id] = agent.system_prompt;
            });
            setPrompts(promptMap);
        }
        if (models) {
            setModels(models);
            console.log("models", models);
        }
    };

    const createNewAssistant = async (
        user_id: string,
        assistant_id: string,
        name: string,
        system_prompt: string,
        description?: string
    ) => {
        const newAssistant = await createAssistant(user_id, assistant_id, name, system_prompt, description);
        // if (newAssistant.assistant_id) {
        //     setAgents([...agents, newAssistant]);
        //     setAgentId(newAssistant.assistant_id);
        //     console.log(`Assistant ${newAssistant.assistant_id} created!`);
        // }
        return newAssistant;
    }

    const saveAssistantUpdates = async (
        user_id: string,
        assistant_id: string,
        name: string,
        system_prompt: string,
        description: string
    ) => {
        const updatedAssistant = await updateAssistant(user_id, assistant_id, name, system_prompt, description);
        // setAgents([...agents.filter((a) => a.assistant_id !== assistant_id), updatedAssistant]);
        // setAgentId(updatedAssistant.assistant_id);
        // console.log(`Assistant ${updatedAssistant.assistant_id} updated!`);
        return updatedAssistant;
    }

    return (
        <AssistantContext.Provider
            value={{
                agents,
                models,
                prompts,
                agentId,
                modelId,
                provider,
                claudeModels,
                veniceModels,
                getAgents,
                setModelId,
                setAgentId,
                setProvider,
                createNewAssistant,
                saveAssistantUpdates
            }}
        >
            {children}
        </AssistantContext.Provider>
    );
};

export const useAssistants = (): AssistantContextType => {
    const context = useContext(AssistantContext);
    if (!context) {
        throw new Error("useAssistants must be used within an AssistantProvider");
    }
    return context;
};
