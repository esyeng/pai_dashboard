import type { NextPage, Metadata } from "next";

export const metadata: Metadata = {
	title: "JasmynAI",
	description: "Private personal AI dashboard",
};
import Image from "next/image";
import { ChatWindow } from "./components/ChatWindow";
import { Options } from "./components/OptionsPanel";

const agents = [
	{ id: "jasmyn", name: "Jasmyn" },
	{ id: "coder", name: "Coder" },
	{ id: "fed", name: "F.E.D." },
	{ id: "tutor", name: "AI Tutor" },
	{ id: "ada", name: "Ada" },
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
							<h1 className="flex cursor-crosshair place-items-center gap-2 p-8 w-full text-[#9de6ca] text-xl py-2 pr-8 rounded leading-tight hover:scale-105">
								{"<"} jasmyn.ai {"/>"}
							</h1>
						</div>
					</div>
				</div>
				<Options agents={agents} models={models} />

				<ChatWindow />

				<div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
			</main>
            <footer className="py-4 text-center">
				<p className="text-mint">
					&copy; {new Date().getFullYear()} Esmé Keats. All rights
					reserved.
				</p>
			</footer>
		</div>
	);
};

export default Home;
