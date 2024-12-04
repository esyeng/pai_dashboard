// src/app/components/ThreadList.tsx
"use client";

import React, { useState, useEffect } from "react";
// import { updateThreadName } from "@/lib/api";
import { useChat } from "@/contexts/ChatContext";
import { useJasmynAuth } from "@/contexts/AuthContext";
import { sortObjectsByCreatedAt } from "@/lib/utils/helpers";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { useWindowResize } from "@/lib/hooks/use-window-resize";



const ThreadList: React.FC = () => {
    const {
        switchThread,
        threadState: { threads, currentThreadId },
        createNewThread,
        deleteThread,
        exportThread,
    } = useChat();
    const { loadComplete, user } = useJasmynAuth()
    const { toggleSidebar, isSidebarOpen } = useSidebar();

    const [open, setOpen] = useState<boolean>(true);
    const [createdOrSelected, setCreatedOrSelected] = useState<boolean>(false);
    const threadsArray = Object.values(threads);
    const sortedThreads = sortObjectsByCreatedAt(threadsArray);


    if (Object.entries(threads).length > 0) {
        // console.log("threadsArray", threadsArray);
        // console.log("sortedThreads", sortedThreads);
    }

    const handleCreateOrSelect = () => {
        if (isSidebarOpen && createdOrSelected) {
            // condition to close from mobile met
            toggleSidebar()
        }
    }


    useWindowResize(handleCreateOrSelect, { minWidth: 640 })
    useEffect(() => {
        if (createdOrSelected) {
            // if sidebar is open and window size is mobile,
            // new thread or select thread should close sidebar
            setCreatedOrSelected(false);
        }
    }, [createdOrSelected])

    // TODO: implement renaming logic
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
        <div className={`h-1/2 shadow-xl flex-1 w-full border-brand-50 rounded-tl-lg rounded-tr-lg rounded-bl-sm rounded-br-sm ${open ? "border-b-4" : ""}`}>
            <div className={`flex sm:flex-col md:flex-row justify-between items-center p-2 bg-brand-50 ${open ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg"}`}  >

                <h2 className="text-sm text-default-font/70  font-bold p-4 md:text-md lg:text-xl">
                    Threads
                </h2>

                <span className={`${open ? "" : ""} sm:w-full md:w-20 text-brand-primary cursor-pointer border-2 border-brand-primary p-2 rounded-sm hover:scale-105 hover:text-default-font text-sm`} onClick={() => setOpen(prev => !prev)}>{open ? "Hide" : "Expand"}</span>
            </div>
            {open &&

                <div className="max-h-96  flex flex-col overflow-y-auto items-center justify-between">
                    <div className="flex w-full justify-center self-end">
                        <button
                            className={`w-full px-4 py-2 bg-brand-300 text-neutral-600  focus:outline-none transition-colors duration-300 border-1 border-brand-50 hover:bg-brand-primary hover:border-transparent hover:text-default-font ${user?.user.id ? "" : "disabled"}`}
                            onClick={() => {
                                createNewThread()
                                setCreatedOrSelected(true);
                            }
                            }
                        >
                            + New Thread
                        </button>
                    </div>
                    <ul className="grid grid-cols-1 overflow-y-auto w-full bg-default-background">
                        {loadComplete && sortedThreads.length > 0 ? (
                            [...sortedThreads].reverse().map((threadItem: any) => {
                                return (
                                    <li
                                        key={threadItem.id}
                                        className="flex min-h-16 items-center justify-between bg-default-background
                                        border-y-1 my-1 rounded-sm border-brand-400"
                                    >
                                        <span
                                            className={`${currentThreadId === threadItem.threadId || currentThreadId === threadItem.thread_id ? "bg-brand-600 text-default-font border-brand-800" : "bg-neutral-50 text-brand-600 border-brand-400 hover:bg-brand-400  hover:text-black "}  border-y-2 flex-1 font-bold self-stretch rounded-tl-sm rounded-bl-sm  py-4 pl-2 pr-1 cursor-pointer duration-300 `}
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
                                                setCreatedOrSelected(true);
                                            }}
                                        >
                                            {threadItem.title !== "New Thread" ? threadItem.title.substring(0, threadItem.title.length) : threadItem.title}
                                        </span>
                                        <div className="h-full border-t-2 border-r-2 border-b-2 border-brand-primary bg-default-background text-brand-primary rounded-tr-sm rounded-br-sm flex">

                                            <button
                                                className="px-2 h-full self-stretch cursor-pointer  focus:outline-none hover:text-default-font hover:scale-105 transition-colors duration-300 hover:underline "
                                                onClick={() =>
                                                    exportThread(threadItem.threadId)
                                                }
                                            >
                                                Export
                                            </button>

                                            <button className="duration-200 ease-in-out hover:opacity-100 border-tr-2 border-br-2 border-brand-500 p-1 flex items-center justify-center hover:border-brand-primary">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 hover:fill-error-200"
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

                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <div className="h-12">
                                <div className="flex items-center justify-center text-default-font bg-default-background rounded-lg p-4">
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
            }
        </div>
    );
};

export default ThreadList;
