"use client";

import React from "react";
import { useChat } from "../../contexts/ChatContext";

interface DropProps {
    agents: { assistant_id: string; name: string }[] | { model_id: string; name: string }[];
    mode: "model" | "agent";
}

export const AgentDropdown: React.FC<DropProps> = ({ agents, mode }) => {
    const { models, agentId, setAgentId, modelId, setModelId } = useChat();

    const handleSelection = (selectionId: string) => {
        if (mode === "model") {
            setModelId(selectionId);

            // if (models[selectionId])
        } else {
            setAgentId(selectionId);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <select
                value={mode === "agent" ? agentId : modelId}
                onChange={(e) => handleSelection(e.target.value)}
                className="block appearance-none w-full font-mono bg-[#151515] border border-[#5fbb97] text-[#9de6ca] py-2 px-4 pr-8 rounded shadow leading-tight hover:bg-caribbean-current focus:bg-caribbean-current focus:outline-none focus:shadow-outline "
            >
                {agents.map((agent) => (
                    <option
                        className="font-mono"
                        key={mode === "agent" ? (agent as { assistant_id: string; name: string }).assistant_id : (agent as { model_id: string; name: string }).model_id}
                        value={mode === "agent" ? (agent as { assistant_id: string; name: string }).assistant_id : (agent as { model_id: string; name: string }).model_id}
                    >
                        {agent.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5fbb97]">
                <svg
                    className="fill-mint h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z" />
                </svg>
            </div>
        </div>
    );
};
