"use client";

import React, { useState, useEffect } from "react";
import { ChatWindow } from "./ChatWindow";
import { Options } from "./OptionsPanel";
import { Sidebar } from "./Sidebar";
import { useChat } from "@/contexts/ChatContext";
import { SignInOrOut } from "./account/SignInOrOut";
import { useAuth } from "@clerk/nextjs";

export const MainContent: React.FC = () => {
	const [sideOnBottom, setSideOnBottom] = useState(false);
	const { isLoaded, getToken } = useAuth();
	const { agents, models, setToken } =
		useChat();

	useEffect(() => {
		const handleResize = () => {
			setSideOnBottom(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (isLoaded) {
			setToken(getToken());
		}
	}, [isLoaded]);

	return (
		<div className="flex justify-between w-full max-md:flex-col">
			{!sideOnBottom ? <Sidebar /> : null}
			<div className="flex flex-col flex-1 px-4 items-center justify-between max-w-full md:overflow-x-auto">
				<SignInOrOut />
				<div className=" w-full items-center justify-between font-mono text-sm lg:flex">
					<div className="flex h-10 w-full items-end justify-center">
						<div className="z-10 bg-ultra-violet text-white">
							<h1 className="flex cursor-crosshair place-items-center gap-2 p-8 w-full text-[#9de6ca] text-xl py-2 pr-8 rounded leading-tight hover:scale-105">
								{"<"} jasmyn.ai {"/>"}
							</h1>
						</div>
					</div>
				</div>
				{isLoaded ? (
					<Options agents={agents} models={models} />
				) : (
					<div className="h-12">
						<div className="flex items-center justify-center bg-gray-200 rounded-lg p-4">
							<svg
								className="w-5 h-5 text-gray-600 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
					</div>
				)}
				<ChatWindow />
				{sideOnBottom ? <Sidebar /> : null}
			</div>
		</div>
	);
};
