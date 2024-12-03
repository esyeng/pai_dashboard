"use client";

import React from "react";
import { useChat } from "../../contexts/ChatContext";

interface DropProps {
    agents: { assistant_id: string; name: string }[] | { model_id: string; name: string }[];
    mode: "model" | "agent";
}

// const STORED_MODEL_ID: string = "model_id";
const STORED_CURRENT_MODEL_ID: string = "current_model_id";
const STORED_CLAUDE_MODEL_ID: string = "claude_id";
const STORED_VENICE_MODEL_ID: string = "venice_id";
const STORED_AGENT_ID: string = "agent_id";

export const AgentDropdown: React.FC<DropProps> = ({ agents, mode }) => {
    const { models, agentId, setAgentId, modelId, setModelId, provider } = useChat();

    const handleSelection = (selectionId: string) => {
        if (mode === "model") {
            setModelId(selectionId);
            localStorage.setItem(STORED_CURRENT_MODEL_ID, selectionId);
            if (provider === "claude") {
                localStorage.setItem(STORED_CLAUDE_MODEL_ID, selectionId);
            } else if (provider === "venice") {
                localStorage.setItem(STORED_VENICE_MODEL_ID, selectionId);
            }
        }
        else if (mode === "agent") {
            setAgentId(selectionId);
            localStorage.setItem(STORED_AGENT_ID, selectionId);
        };
    };

    // useEffect(() => {
    //     setModelId(provider === "claude" ? claudeModels[0] : veniceModels[0]);
    //     localStorage.setItem(STORED_MODEL_ID, provider === "claude" ? claudeModels[0] : veniceModels[0]);
    // }, [provider])

    return (
        <div className="relative inline-block text-left min-w-40 w-full lg:text-sm">
            <select
                value={mode === "agent" ? agentId : modelId}
                onChange={(e) => handleSelection(e.target.value)}
                className="lg:text-xs block appearance-none w-full font-mono bg-default-background border border-brand-primary text-brand-primary py-2 px-4 pr-8 rounded-md leading-tight hover:bg-brand-50/60 focus:bg-brand-50/30 focus:outline-none bg-none"

            >
                {agents.map((agent) => (
                    <option
                        className="font-mono lg:text-sm"
                        key={mode === "agent" ? (agent as { assistant_id: string; name: string }).assistant_id : (agent as { model_id: string; name: string }).model_id}
                        value={mode === "agent" ? (agent as { assistant_id: string; name: string }).assistant_id : (agent as { model_id: string; name: string }).model_id}
                    >
                        {agent.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-default-font">
                <svg
                    className="fill-brand-primary h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z" />
                </svg>
            </div>
        </div>
    );
};
