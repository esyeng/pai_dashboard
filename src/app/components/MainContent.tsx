"use client";

import React, { useState, useEffect } from "react";
import { ChatWindow } from "./ChatWindow";
import { Options } from "./OptionsPanel";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { useWindowResize } from "@/lib/hooks/use-window-resize";
import { useChat } from "@/contexts/ChatContext";
import { SignInOrOut } from "./account/SignInOrOut";
import { useAuth } from "@clerk/nextjs";

export const MainContent: React.FC = () => {
    const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useSidebar();
    const { isLoaded, getToken } = useAuth();
    const { agents, models, setToken, token, setLatestToken } = useChat();
    const [hideChat, setHideChat] = useState(true);

    const handleSidebar = () => {
        let el = document.getElementById("sidebar");
        if (isSidebarOpen) {
            setHideChat(true);
            // bring z index back to normal for using sidebar
            el?.classList.remove("-z-10");
        }
        else {
            setHideChat(false);
            // high z index of hidden sidebar was blocking actions on chat for small screens
            el?.classList.add("-z-10");
        }
    }

    const handleHideChat = () => {
        setHideChat(false);
        if (!isSidebarOpen) {
            toggleSidebar();
        }
    }

    // first resize event ensures that on mobile screens, sidebar being open hides chat
    // second resize event ensures that the sidebar is always open and chat isnt hidden
    // on screens larger than mobile
    useWindowResize(handleSidebar, { minWidth: 640 });
    useWindowResize(handleHideChat, { maxWidth: 640 });

    useEffect(() => {
        if (isLoaded) {
            let t = getToken()
            setToken(t);
            setLatestToken(t);
        }
    }, [isLoaded]);

    return (
        <div className=" ">
            <div className="space-y-2">
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded text-xs font-mono shadow leading-tight hover:text-mint hover:bg-gradient-to-b hover:from-[#4ce6ab2d] hover:to-[#052b1c5b] sm:hidden">
                    {isSidebarOpen ? (<span className="min-w-5 ease-in-out duration-300 text-tea-green">X</span>) : (<div className="space-y-2 ease-in-out duration-300">
                        <span className="block w-5 h-0.5 bg-tea-green"></span>
                        <span className="block w-2 h-0.5 bg-tea-green"></span>
                    </div>
                    )}
                </button>

            </div>
            <div
                id="sidebar"
                className="w-full absolute sm:w-1/4 sm:static"
            >
                <Sidebar />
            </div>
            {hideChat ? (null) : (<div className={`w-full sm:visible sm:w-3/4`}>
                <div className=" items-center justify-around">
                    <div className="  items-center justify-between font-mono text-sm ">
                        <div className=" items-end justify-center">
                            <div className="z-10 bg-ultra-violet text-white">
                                <h1 className=" cursor-crosshair place-items-center gap-2 p-8 text-[#9de6ca] text-lg py-2 pr-8 rounded leading-tight hover:scale-105">
                                    {"<"} jasmyn.ai {"/>"}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <SignInOrOut />
                </div>
                {isLoaded ? (
                    <>
                        <Options agents={agents} models={models} />
                    </>

                ) : (
                    <div className="h-12">
                        <div className=" items-center justify-center bg-gray-200 rounded-lg p-4">
                            <span className="text-gray-600">Loading...</span>
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
            </div>)}
        </div>
    );
};

