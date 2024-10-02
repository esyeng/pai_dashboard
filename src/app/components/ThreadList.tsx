// src/app/components/ThreadList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Thread } from "@/lib/types";
import { updateThreadName } from "@/lib/api";
import { useChat } from "@/contexts/ChatContext";

export interface Message {
	id: string;
	content: string;
	createdAt: Date;
	userId: string;
}

const ThreadList: React.FC = () => {
	const {
		setThreads,
		currentThreadId,
		switchThread,
		threads,
		loadComplete,
		createNewThread,
		deleteThread,
		exportThread,
		user,
	} = useChat();

	const threadsArray = Object.values(threads);

	if (Object.entries(threads).length > 0) {
		console.log("threadsArray", threadsArray);
	}

	const handleThreadNameKeyDown = async (
		event: React.KeyboardEvent<HTMLSpanElement>,
		thread: Thread | any
	) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const newName = (
				event.target as HTMLSpanElement
			).textContent?.trim();
			if (newName !== "") {
				switchThread(thread.id);
				// await updateThreadName(thread.id, newName);
				console.log("call to backend: update thread name");
			}
		}
	};

	return (
		<div className=" rounded-xl shadow-xl flex-1 w-full">
			<h2 className="text-lg text-caribbean-current font-bold mb-2 bg-mint bg-opacity-85 rounded-tl-lg rounded-tr-lg p-4">
				Threads
			</h2>
			<div className="max-h-96  flex flex-col overflow-y-auto items-center justify-between">
            <div className="flex w-full justify-center self-end">
					<button
						className={`mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none  transition-colors duration-300 border-2 border-mint hover:bg-mint hover:border-transparent hover:text-caribbean-current ${user?.id ? "" : "disabled"}`}
						onClick={() => createNewThread()}
					>
						+ New Thread
					</button>
				</div>
				<ul className="grid grid-cols-1 gap-2 overflow-y-auto p-4 ">
					{loadComplete && threadsArray.length > 0 ? (
						[...threadsArray].reverse().map((threadItem: any) => {
							// console.log("thread from threadsArray", threadItem);
                            if (threadItem.title !== "New Thread" && threadItem.messages?.length == 0) {
                                // deleteThread(threadItem.id);
                                return null;
                            }
							return (
								<li
									key={threadItem.id}
									className="flex min-h-16 items-center justify-between  bg-gray-200 rounded-lg border-2 border-mint"
								>
									<span
										className="text-caribbean-current font-bold bg-mint self-stretch p-2 hover:transition-colors cursor-pointer duration-300 hover:bg-mint/20 rounded-l-lg"
										// contentEditable="true"
										// onInput={handleThreadNameInput}
										// onKeyDown={(event) =>
										// 	handleThreadNameKeyDown(
										// 		event,
										// 		threadItem
										// 	)
										// }
										onClick={() => {
											console.log("switching thread", threadItem.thread_id);
											switchThread(threadItem.thread_id);
										}}
									>
										{threadItem.title !== "New Thread" ? threadItem.title.substring(0, threadItem.title.length) : threadItem.title}
									</span>
									<button className="opacity-0 transition-opacity duration-200 ease-in-out hover:opacity-100 bg-transparent border-none rounded-full p-1 flex items-center justify-center">
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
										onClick={() =>
											exportThread(threadItem.id)
										}
									>
										Export
									</button>
								</li>
							);
						})
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
				</ul>
				<div className="bg-orange-100 rounded-b-lg rounded-tr-lg">
				</div>
			</div>

		</div>
	);
};

export default ThreadList;

{/* <h2 className="text-lg text-caribbean-current font-bold ">
					{loadComplete && threadsArray.length > 0
						? `Total: ${[...threadsArray].filter(
								thread =>
									Array.isArray(thread.messages) &&
									thread.messages.length !== 0
							).length}`
						: ""}
				</h2> */}
