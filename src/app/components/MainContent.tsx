"use client";

import React, { useState, useEffect } from "react";
import { ChatWindow } from "./ChatWindow";
import { Options } from "./OptionsPanel";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { useWindowResize } from "@/lib/hooks/use-window-resize";
import { useChat } from "@/contexts/ChatContext";
import { useAssistants } from "@/contexts/AssistantContext";
import { useJasmynAuth } from "@/contexts/AuthContext";
import { useAuth } from "@clerk/nextjs";
import MessageLoadingIndicator from "./ui/MessageLoadingIndicator";

export const MainContent: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const { isLoaded, getToken } = useAuth();
    const { fetchThreadsData } = useChat();
    const { models, getAgents } = useAssistants();
    const { setToken, setLatestToken, user } = useJasmynAuth();
    const [hideChat, setHideChat] = useState(true);
    const barNode = document.getElementById("sidebar");

    const handleSidebar = () => {
        if (isSidebarOpen) {
            setHideChat(true);
            // bring z index back to normal for using sidebar
            barNode?.classList.remove("-z-10");
        }
        else {
            setHideChat(false);
            // high z index of hidden sidebar was blocking actions on chat for small screens
            barNode?.classList.add("-z-10");
            barNode?.classList.remove("z-10");
        }
    }

    const handleHideChat = () => {
        setHideChat(false);
        if (!isSidebarOpen) {
            toggleSidebar();
        }
        if (barNode && barNode.classList.contains("-z-10")) {
            barNode.classList.remove("-z-10");
            barNode.classList.add("z-10");
        }
    }

    // first resize event ensures that on mobile screens, sidebar being open hides chat
    useWindowResize(handleSidebar, { minWidth: 640 });
    // second resize event ensures that the sidebar is always open and chat isnt hidden
    // on screens larger than mobile
    useWindowResize(handleHideChat, { maxWidth: 640 });

    useEffect(() => {
        if (isLoaded) { // clerk auth load completion flag
            let t = getToken()
            setToken(t);
            setLatestToken(t);
        }
    }, [isLoaded]);

    useEffect(() => {
        if (!user || !user.user_id) return;
        getAgents(user); // populate assistants state
        fetchThreadsData(user.user_id); // populate threads state
    }, [user]);

    return (
        <div className="sm:flex">
            <div className="space-y-2">
                <button
                    onClick={toggleSidebar}
                    className="p-1 min-w-6 rounded-sm text-xs font-mono shadow leading-tight text-brand-primary  hover:text-default-font hover:border-2 hover:border-brand-primary hover:p-1 hover:rounded-sm  sm:hidden">
                    {isSidebarOpen ? (<span className="min-w-5 text-brand-primary">X</span>) : (<div className="space-y-2   ">
                        <span className="block w-5 h-0.5 bg-brand-primary "></span>
                        <span className="block w-2 h-0.5 bg-brand-primary"></span>
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
            {hideChat ? (null) : (<div className={`w-full sm:visible sm:w-3/4 sm:self-end lg:mx-4`}>
                <div className=" items-center justify-around">
                    <div className="  items-center justify-between font-mono text-sm ">
                        <div className="flex items-center justify-center">
                            <div className=" items-center justify-center bg-ultra-violet text-white">
                                <h1 className="font-monospace-body cursor-default place-items-center gap-2 p-8 text-brand-primary text-lg py-2 pr-8 rounded leading-tight">
                                    {"<"} jasmin.ai {"/>"}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                {isLoaded ? (
                    <>
                        <Options models={models} />
                    </>

                ) : (
                    <div className="h-12">
                        <div className=" items-center justify-center rounded-lg p-4">
                            <span className="text-gray-600">Loading...</span>
                            <MessageLoadingIndicator />
                        </div>
                    </div>
                )}
                <ChatWindow />
            </div>)}
        </div>
    );
};

