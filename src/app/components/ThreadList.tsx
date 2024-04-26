// src/app/components/ThreadList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Thread } from "@/lib/types";
import { fetchThreads, createThread, exportThread } from "@/lib/api";

const ThreadList: React.FC = () => {
	const [threads, setThreads] = useState<Thread[]>([]);

	useEffect(() => {
		const getThreads = async () => {
			const fetchedThreads = await fetchThreads();
			setThreads(fetchedThreads);
		};
		// getThreads();
		("get threads");
	}, []);

	const handleCreateThread = async () => {
		// const newThread = await createThread();
		// setThreads([...threads, newThread]);
		console.log("create thread");
	};

	const handleExportThread = async (threadId: string) => {
		await exportThread(threadId);
	};

	const handleDeleteThread = async (threadId: string) => {
		// const response = await fetch(`${BASE}/db/threads/${threadId}`, {
		//     method: "DELETE",
		// });
		console.log("delete thread");
	};

	return (
		<div className=" rounded-xl shadow-xl">
			<h2 className="text-lg text-caribbean-current font-bold mb-2 bg-mint bg-opacity-85 rounded-tl-lg rounded-tr-lg p-4">
				Threads
			</h2>
			<ul className="space-y-2">
				{threads.map((thread) => (
					<li
						key={thread.id}
						className="flex items-center justify-between bg-gray-200 p-4 rounded-lg"
					>
						<span className="text-gray-700 font-bold">
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
							className="px-2 py-1 bg-blue-500 text-white rounded-md focus:outline-none"
							onClick={() => handleExportThread(thread.id)}
						>
							Export
						</button>
					</li>
				))}
			</ul>
			<div className="bg-orange-100 rounded-b-lg rounded-tr-lg">
				<div className="bg-orange-200 rounded-tl-md rounded-tr-md py-2 px-4">
					<ul className="flex space-x-4">
						<li className="rounded-tl-md rounded-tr-md transition-colors duration-300 hover:bg-orange-100 relative ">
							<button className="active py-2 px-4 relative border-mint border-1 ">
								Tab 1
								<span className="absolute bottom-0 left-0 w-full h-px bg-orange-100"></span>
							</button>
						</li>
						<li className="rounded-tl-md rounded-tr-md transition-colors duration-300 hover:bg-orange-100 relative border-mint border-b-1 border-l-1">
							<button className="py-2 px-4">Tab 2</button>
						</li>
					</ul>
				</div>
				{/* Tab Content */}
			</div>
			<button
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none"
				onClick={handleCreateThread}
			>
				New Thread
			</button>
		</div>
	);
};

export default ThreadList;
