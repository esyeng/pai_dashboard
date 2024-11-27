"use client";

// import * as Slider from '@radix-ui/react-slider';
// import * as Separator from '@radix-ui/react-separator';
import { AgentDropdown } from "./AgentDropdown";
import AgentManager from "./AgentManager";
import ModeSwitch from "./ModeSwitch";
import { useChat } from "@/contexts/ChatContext";


interface OptionsProps {
    agents: { assistant_id: string; name: string }[];
    models: { model_id: string; name: string }[];
}

export const Options: React.FC<OptionsProps> = ({ agents, models }) => {
    const { provider, setProvider } = useChat();
    const providers = ["claude", "venice"];
    return (
        <div className="flex  justify-center w-full sm:flex-col">
            <div className="mb-4 mx-2 flex flex-1 flex-col items-center justify-center my-2 lg:flex-row p-2 rounded-lg bg-brand-50/70 ">
                <ModeSwitch modes={providers} setter={setProvider}/>

                <div className="flex justify-center items-center px-2 my-1 mx-4">
                    <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">
                        Model:{" "}
                    </span>
                    <span className="text-md text-brand-primary my-4 mr-2">
                        |
                    </span>
                    <AgentDropdown agents={models} mode="model" />
                </div>
                <div className="flex justify-center items-center px-2 my-1 mx-4">
                    <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">
                        Agent:{" "}
                    </span>
                    <span className="text-md text-brand-primary my-4 mr-2">
                        |
                    </span>
                    <AgentDropdown agents={agents} mode="agent" />
                </div>
                <div className="flex justify-center items-center px-2 my-1 mx-4">
                    <AgentManager />
                </div>
            </div>
        </div>
    );
};
