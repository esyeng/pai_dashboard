import type { NextPage, Metadata } from "next";

export const metadata: Metadata = {
	title: "JasmynAI",
	description: "Private personal AI dashboard",
};
import Image from "next/image";
import { ChatWindow } from "./components/ChatWindow";
import { AgentDropdown } from "./components/AgentDropdown";

const agents = [
	{ id: "tutor", name: "Tutor" },
	{ id: "coder", name: "Coder" },
	{ id: "ada", name: "Ada" },
	{ id: "fed", name: "FED" },
];

const models = [
	{ id: "claude-3-opus-20240229", name: "Opus" },
	{ id: "claude-3-sonnet-20240229", name: "Sonnet" },
	{ id: "claude-3-haiku-20240307", name: "Haiku" },
];

const Home: NextPage = () => {
	return (
		<div className="container mx-auto">
			<main className="flex h-full flex-col items-center justify-between px-14 py-2 my-16">
				<div className=" w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
					<div className="flex h-10 w-full items-end justify-center">
						<div className="z-10 bg-ultra-violet text-white">
							<h1 className="flex place-items-center gap-2 p-8 w-full text-[#9de6ca] text-xl py-2 pr-8 rounded leading-tight">
								JasmynAI
							</h1>
						</div>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="mb-4 flex flex-col items-center justify-center my-2 sm:flex-row p-2 rounded-3xl bg-[#4ce6ab2d]">
						<div className="flex justify-center items-center px-2 my-1 mx-4">
							<span className="text-caribbean-current text-sm py-2 pr-2 rounded leading-tight">
								Model:{" "}
							</span>
							<span className="text-md text-caribbean-current my-4 mr-2">
								|
							</span>
							<AgentDropdown agents={models} mode="model" />
						</div>
						<div className="flex justify-center items-center px-2 my-1 mx-4">
							<span className="text-caribbean-current text-sm py-2 pr-2 rounded leading-tight">
								Agent:{" "}
							</span>
							<span className="text-md text-caribbean-current my-4 mr-2">
								|
							</span>
							<AgentDropdown agents={agents} mode="agent" />
						</div>
					</div>
				</div>
				<div className="container mx-auto px-4 py-4 h-full bg-mint rounded-lg shadow-2xl sm:w-3/4 lg:w-2/3 lg:h-4/5">
					<div className="w-full mx-auto h-full">
						<ChatWindow />
					</div>
				</div>

				<div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
			</main>
			<footer className="py-4 text-center">
				<p className="text-gray">
					&copy; {new Date().getFullYear()} Esmé Keats. All rights
					reserved.
				</p>
			</footer>
		</div>
	);
};

export default Home;
