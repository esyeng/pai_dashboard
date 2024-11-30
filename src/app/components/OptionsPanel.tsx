"use client";
import { useEffect } from "react";
import { AgentDropdown } from "./AgentDropdown";
import AgentManager from "./AgentManager";
import ModeSwitch from "./ModeSwitch";
import { useChat } from "@/contexts/ChatContext";


interface OptionsProps {
    // agents: { assistant_id: string; name: string }[];
    models: { model_id: string; name: string }[];
}

const STORED_CLAUDE_MODEL_ID: string = "claude_id";
const STORED_VENICE_MODEL_ID: string = "venice_id";
const STORED_CURRENT_MODEL_ID: string = "current_model_id";

const modelStore = {
    "claude": localStorage.getItem(STORED_CLAUDE_MODEL_ID) || "",
    "venice": localStorage.getItem(STORED_VENICE_MODEL_ID) || ""
}


export const Options: React.FC<OptionsProps> = ({ models }) => {
    const { provider, setProvider, agents, agentId, modelId, setModelId } = useChat();
    const providers = ["claude", "venice"];
    const claudeModels = ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"]
    const veniceModels = ["flux-dev-uncensored", "fluently-xl", "flux-dev", "nous-theta-8b", "llama-3.2-3b", "dolphin-2.9.2-qwen2-72b", "llama-3.1-405b", "qwen32b"]
    const selectedAgent = agents.find((a) => a.assistant_id === agentId)?.name;


    const handleSwitch = (providerStr: string) => {
        console.log("prov str", providerStr);
        if (providerStr.toLowerCase() === "venice") {
            localStorage.setItem(STORED_CLAUDE_MODEL_ID, localStorage.getItem(STORED_CURRENT_MODEL_ID) || claudeModels[0]);
            localStorage.setItem(STORED_CURRENT_MODEL_ID, localStorage.getItem(STORED_VENICE_MODEL_ID) || veniceModels[0]);
            setProvider("venice");
        } else if (providerStr.toLowerCase() === "claude") {
            localStorage.setItem(STORED_VENICE_MODEL_ID, localStorage.getItem(STORED_CURRENT_MODEL_ID) || veniceModels[0]);
            localStorage.setItem(STORED_CURRENT_MODEL_ID, localStorage.getItem(STORED_CLAUDE_MODEL_ID) || claudeModels[0]);
            setProvider("claude");
        }
    }

    let ids = models.map((model) => model.model_id);
    console.log("modelIds", ids)
    return (
        <div className="flex  justify-center w-full sm:flex-col">
            <div className="mb-4 mx-2 flex flex-1 flex-col items-center justify-center my-2 lg:flex-row p-2 rounded-lg bg-brand-50/70 ">
                <ModeSwitch modes={providers} setter={handleSwitch} />

                <div className="flex justify-center items-center px-2 my-1 mx-4">
                    <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">
                        Model:{" "}
                    </span>
                    <span className="text-md text-brand-primary my-4 mr-2">
                        |
                    </span>
                    <AgentDropdown agents={provider === "claude" ? models.filter((m) => claudeModels.includes(m.model_id)) : models.filter((m) => veniceModels.includes(m.model_id))} mode="model" />
                </div>
                <div className="flex justify-center items-center px-2 my-1 mx-4">
                    <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">
                        Selected agent:{" "}
                    </span>
                    <span className="text-md text-brand-primary my-4 mr-2">
                        |
                    </span>
                    {/* <AgentDropdown agents={agents} mode="agent" /> */}
                    <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">
                        {selectedAgent}
                    </span>
                </div>
                <div className="flex justify-center items-center px-2 my-1 mx-4">
                    <AgentManager />
                </div>
            </div>
        </div>
    );
};
