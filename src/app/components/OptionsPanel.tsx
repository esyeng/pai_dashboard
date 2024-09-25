"use client";

// import * as Slider from '@radix-ui/react-slider';
// import * as Separator from '@radix-ui/react-separator';
import { AgentDropdown } from "./AgentDropdown";

interface OptionsProps {
	agents: { assistant_id: string; name: string }[];
	models: { model_id: string; name: string }[];
}

export const Options: React.FC<OptionsProps> = ({ agents, models }) => {
	return (
		<div className="flex  justify-center w-full sm:flex-col">
			<div className="mb-4 flex flex-1 flex-col items-center justify-center my-2 lg:flex-row p-2 rounded-3xl bg-gradient-to-b from-[#4ce6ab2d] to-[#0ea46a3b] shadow-xl">
				<div className="flex justify-center items-center px-2 my-1 mx-4">
					<span className="text-[#9de6ca] text-lg py-2 pr-2 rounded leading-tight">
						Model:{" "}
					</span>
					<span className="text-md text-caribbean-current my-4 mr-2">
						|
					</span>
					<AgentDropdown agents={models} mode="model" />
				</div>
				<div className="flex justify-center items-center px-2 my-1 mx-4">
					<span className="text-[#9de6ca] text-lg py-2 pr-2 rounded leading-tight">
						Agent:{" "}
					</span>
					<span className="text-md text-caribbean-current my-4 mr-2">
						|
					</span>
					<AgentDropdown agents={agents} mode="agent" />
				</div>
			</div>
		</div>
	);
};
