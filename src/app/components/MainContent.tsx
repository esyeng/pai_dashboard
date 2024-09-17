"use client";

import React, { useState, useEffect, use } from "react";
import { ChatWindow } from "./ChatWindow";
import { Options } from "./OptionsPanel";
import { Sidebar } from "./Sidebar";
import { useChat } from "@/contexts/ChatContext";

import { agents, models } from "../../lib/store";
import { useAuth } from "@clerk/nextjs";

export const MainContent: React.FC = () => {
	const [sideOnBottom, setSideOnBottom] = useState(false);
	const { isLoaded, userId, sessionId, getToken } = useAuth();
	const { threads, user, setToken, agentId, modelId } = useChat();

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
		console.log(
			`data present in MainContent after isLoaded is evaluated: first, is it?: ${isLoaded}. Soo the userId is: ${userId} and the sessionId is: ${sessionId} and the token is: ${getToken()}. user?: ${user} and agentId?: ${agentId} and modelId?: ${modelId} and threads?: ${threads} and agents?: ${agents} and models?: ${models} and sideOnBottom?: ${sideOnBottom} and setSideOnBottom?: ${setSideOnBottom}`
		);
	}, [isLoaded]);

	return (
		<div className="flex justify-between w-full max-md:flex-col">
			{!sideOnBottom ? <Sidebar /> : null}
			<div className="flex flex-col flex-1 px-4 items-center justify-between max-w-full overflow-x-auto">
				<div className=" w-full items-center justify-between font-mono text-sm lg:flex">
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
				{sideOnBottom ? <Sidebar /> : null}
			</div>
		</div>
	);
};

/**
 * const [sideOnBottom, setSideOnBottom] = useState(false);
 *
 * div className="flex justify-between w-full max-sm:flex-col">
					{!sideOnBottom ? (
						<Sidebar setSideOnBottom={setSideOnBottom} />
					) : null}
					<div className="flex flex-col flex-1 px-4 items-center justify-between ">
						<div className=" w-full items-center justify-between font-mono text-sm lg:flex">
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
						{sideOnBottom ? <Sidebar /> : null}
					</div>
				</div>

				<div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
 */
