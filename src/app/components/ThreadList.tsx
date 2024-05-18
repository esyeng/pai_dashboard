// src/app/components/ThreadList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Thread } from "@/lib/types";
import { exportThread, fetchThreads, updateThreadName } from "@/lib/api";
import { useChat } from "@/contexts/ChatContext";

export interface Message {
	id: string;
	content: string;
	createdAt: Date;
	userId: string;
}

const threadsDummyData: Thread[] = [
	{
		id: "1",
		title: "Thread 1",
		createdAt: new Date(),
		userId: "1",
		path: "/thread/1",
		messages: [
			{
				id: "1",
				msg: { role: "user", content: "Hello, world!" },
				timestamp: new Date(),
				sender: "test-user",
				agentId: "jasmyn",
			},
		],
	},
	{
		id: "2",
		title: "Thread 2",
		createdAt: new Date(),
		userId: "1",
		path: "/thread/2",
		messages: [
			{
				id: "1",
				msg: { role: "assistant", content: "Um. Hi!" },
				timestamp: new Date(),
				sender: "jasmyn",
				agentId: "jasmyn",
			},
		],
	},
];

const ThreadList: React.FC = () => {
	const { setThreads, switchThread } = useChat();

	useEffect(() => {
		// const getThreads = async () => {
		// 	const fetchedThreads = await fetchThreads();
		// 	setThreads(fetchedThreads);
		// };
		// getThreads();
		("call to backend: get threads");
	}, []);

	const handleCreateThread = async () => {
		// const newThread = await createThread();
		// setThreads([...threads, newThread]);
		console.log("call to backend: create thread");
	};

	const handleExportThread = async (thread: Thread) => {
		exportThread(thread);
	};

	const handleDeleteThread = async (threadId: string) => {
		// const response = await fetch(`${BASE}/db/threads/${threadId}`, {
		//     method: "DELETE",
		// });
		console.log("call to backend: delete thread");
	};

	function handleThreadNameInput(event: React.FormEvent<HTMLSpanElement>) {
		const newName = (event.target as HTMLSpanElement).textContent;
	}

	const handleThreadNameKeyDown = async (
		event: React.KeyboardEvent<HTMLSpanElement>,
		thread: Thread
	) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const newName = (
				event.target as HTMLSpanElement
			).textContent?.trim();
			if (newName !== "") {
				switchThread(thread ? thread.id : "");
				// await updateThreadName(thread.id, newName);
				console.log("call to backend: update thread name");
			}
		}
	};

	return (
		<div className=" rounded-xl shadow-xl flex-1 w-full h-full">
			<h2 className="text-lg text-caribbean-current font-bold mb-2 bg-mint bg-opacity-85 rounded-tl-lg rounded-tr-lg p-4">
				Threads
			</h2>
			<div className="flex flex-col items-center justify-between">
				<ul className="space-y-2 flex-1 w-full">
					{threadsDummyData.map((thread) => (
						<li
							key={thread.id}
							className="flex items-center justify-between bg-gray-200 rounded-lg border-2 border-mint"
						>
							<span
								className="text-caribbean-current font-bold bg-mint self-stretch p-2 hover:transition-colors cursor-pointer duration-300 hover:bg-mint/20 rounded-l-lg"
								// contentEditable="true"
								// onInput={handleThreadNameInput}
								// onKeyDown={(event) =>
								// 	handleThreadNameKeyDown(event, thread)
								// }
							>
								{thread.title}
							</span>
							<button
								className="opacity-0 transition-opacity duration-200 ease-in-out hover:opacity-100 bg-transparent border-none rounded-full p-1 flex items-center justify-center"
								onClick={() => handleDeleteThread(thread.id)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
							<button
								className="px-2 self-stretch cursor-pointer bg-blue-500 text-white rounded-md focus:outline-none hover:text-light-coral hover:scale-105 transition-colors duration-300"
								onClick={() => handleExportThread(thread)}
							>
								Export
							</button>
						</li>
					))}
				</ul>
				<div className="bg-orange-100 rounded-b-lg rounded-tr-lg">
					{/* <div className="rounded-tl-md rounded-tr-md ">
					<ul className="flex  items-stretch justify-stretch">
						<li className="flex-1 rounded-tl-md rounded-tr-md transition-colors duration-300 hover:bg-mint  ">
							<button className="flex-1 w-full active py-2 px-4 ">
								Tab 1
								<span className=" bottom-0 left-0 w-full h-px bg-light-coral"></span>
							</button>
						</li>
						<li className=" w-100 flex-1 rounded-tl-md rounded-tr-md transition-colors duration-300 hover:bg-mint border-mint border-b-1 border-l-1">
							<button className="py-2 px-4 border-mint border-b-1">
								Tab 2
							</button>
						</li>
					</ul>
				</div> */}
					{/* Tab Content */}
				</div>
				<div className="flex w-full justify-center self-end">
					<button
						className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none  transition-colors duration-300 border-2 border-mint hover:bg-mint hover:border-transparent hover:text-caribbean-current"
						onClick={handleCreateThread}
					>
						+ New Thread
					</button>
				</div>
			</div>
		</div>
	);
};

export default ThreadList;
