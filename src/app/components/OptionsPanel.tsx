"use client";
import { useEffect } from "react";
import { AgentDropdown } from "./AgentDropdown";
import AgentManager from "./AgentManager";
import ModeSwitch from "./ModeSwitch";
import { useChat } from "@/contexts/ChatContext";
import { useAssistants } from "@/contexts/AssistantContext";
import { useSearch } from "@/contexts/SearchContext";


interface OptionsProps {
    models: { model_id: string; name: string }[];
}

const STORED_CLAUDE_MODEL_ID: string = "claude_id";
const STORED_VENICE_MODEL_ID: string = "venice_id";
const STORED_CURRENT_MODEL_ID: string = "current_model_id";

const modelStore = {
    "claude": localStorage.getItem(STORED_CLAUDE_MODEL_ID) || "",
    "venice": localStorage.getItem(STORED_VENICE_MODEL_ID) || ""
}
const STORED_PROVIDER_ID: string = "provider_id";

// const veniceModels = ["llama-3.1-405b", "llama-3.2-3b", "dolphin-2.9.2-qwen2-72b", "flux-dev-uncensored", "fluently-xl", "flux-dev", "nous-theta-8b", "qwen32b"]


export const Options: React.FC<OptionsProps> = ({ models }) => {
    const { provider, veniceModels, claudeModels, setProvider, agents, agentId, modelId, setModelId } = useAssistants();
    const { shouldQueryResearchModel } = useSearch()
    const providers = ["claude", "venice"];
    const searchProviders = ["claude"];

    const selectedAgent = agents.find((a) => a.assistant_id === agentId)?.name;
    const mode = localStorage?.getItem(STORED_PROVIDER_ID) || "claude";
    const storedCurrent = localStorage.getItem(STORED_CURRENT_MODEL_ID);
    const storedVenice = localStorage.getItem(STORED_VENICE_MODEL_ID);
    const storedClaude = localStorage.getItem(STORED_CLAUDE_MODEL_ID);


    const handleSwitch = (providerStr: string) => {
        console.log("prov str", providerStr);

        if (providerStr.toLowerCase() === "venice") { // on switch to venice, set current model to stored venice or first if none
            setProvider("venice");
            localStorage.setItem(STORED_CURRENT_MODEL_ID, storedVenice ?? veniceModels[0]);
            setModelId(storedVenice ?? veniceModels[0]);
        } else if (providerStr.toLowerCase() === "claude") { // on switch to claude, set current model to stored claude or first if none
            setProvider("claude");
            localStorage.setItem(STORED_CURRENT_MODEL_ID, storedClaude ?? claudeModels[0]);
            setModelId(storedClaude ?? claudeModels[0]);
        }
        localStorage.setItem(STORED_PROVIDER_ID, providerStr.toLowerCase());
    }

    useEffect(() => {
        if (typeof storedCurrent === 'string') { // if provider changed and there is a val for storedCurrent, set model to current
            setModelId(storedCurrent)
        }
        console.log(`
            {
                active modelId: ${modelId},
                storedCurrent: ${storedCurrent},
                storedVenice: ${storedVenice},
                storedClaude: ${storedClaude}
                }
                `)
    }, [provider]);


    let ids = models.map((model) => model.model_id);
    console.log("modelIds", ids)
    return (
        <div className="flex justify-center w-full sm:flex-col lg:mx-4 lg:pr-4 lg:sticky">
            <div className="mb-4 mx-2 w-full flex flex-col items-center justify-center my-2 lg:flex-row  p-2 rounded-lg bg-brand-50/70 sm:mx-0 ">
                <div className="md:w-full lg:w-auto lg:flex justify-evenly">
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex flex-2 lg:flex-col justify-center items-center px-2 my-1 mx-4 md:mx-0 lg:pl-16">
                            <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight lg:self-start ">
                                Provider:{" "}
                            </span>
                            <span className="text-md text-brand-primary my-4 mr-2 lg:hidden">
                                |
                            </span>
                            {shouldQueryResearchModel ? (<ModeSwitch mode={mode} modes={searchProviders} setter={handleSwitch} />) : (<ModeSwitch mode={mode} modes={providers} setter={handleSwitch} />)}
                        </div>

                        <div className="flex flex-2 justify-center items-center px-2 my-1 mx-4 md:mx-0">
                            <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">
                                Model:{" "}
                            </span>
                            <span className="text-md text-brand-primary my-4 mr-2">
                                |
                            </span>
                            <AgentDropdown agents={provider === "claude" ? models.filter((m) => claudeModels.includes(m.model_id)) : models.filter((m) => veniceModels.includes(m.model_id))} mode="model" />
                        </div>
                    </div>
                    <div className="flex justify-center items-center px-2 my-1 mx-4 sm:mx-0">

                        <div className="lg:flex-1 min-w-36 lg:min-w-20">
                            <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight flex-1 min-w-28 sm:text-sm">
                                Selected agent:{" "}
                            </span>
                            <span className="text-md text-brand-primary my-4 mr-2">
                                |
                            </span>
                        </div>
                        <div className="self-center w-min lg:flex-3 lg:w-full min-w-16">

                            <span className="text-default-font text-md py-2 pr-2 rounded leading-tight ">
                                {selectedAgent}
                            </span>
                        </div>
                        {/* <AgentDropdown agents={agents} mode="agent" /> */}
                    </div>
                    <div className="flex justify-center items-center px-2 my-1 mx-4 sm:mx-0">
                        <AgentManager />
                    </div>
                </div>
            </div>
        </div>
    );
};
