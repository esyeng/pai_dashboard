"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import React from "react";
import NotesPanel from "./NotesPanel";
import ThreadList from "./ThreadList";
import { SearchOptions } from "./SearchOptions";
import { useChat } from "@/contexts/ChatContext";
import { useSidebar } from "@/lib/hooks/use-sidebar";

export const Sidebar: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const { shouldQueryResearchModel, setShouldQueryResearchModel } = useChat();

    const toggleSearchOptions = () => {
        setShouldQueryResearchModel(!shouldQueryResearchModel);
    }

    return (
        <div className={`top-0 left-0 h-screen ease-in-out duration-300 bg-default-background ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:w-1/4 sm:h-full sm:fixed`}>
            <div className="">

                <div className="flex justify-center items-center px-2 my-1 mx-4">

                    <button
                        onClick={toggleSearchOptions}
                        className={`${shouldQueryResearchModel ? " text-black " : " bg-gradient-to-b from-brand-50 to-brand-200 "} p-1 mt-8 mb-4  text-default-font rounded font-mono border shadow leading-tight duration-200 w-full  border-brand-primary resize-y  hover:bg-brand-primary`}
                    >
                        Toggle Search Options
                    </button>
                </div>
                {shouldQueryResearchModel &&
                    (<div className={`mb-2 pb-2 px-8 w-full transition-all duration-700 ease-in-out overflow-scroll ${shouldQueryResearchModel ? 'max-h-screen' : 'max-h-0'}`}>
                        <SearchOptions />
                    </div>
                    )}
                    <NotesPanel />
                    <ThreadList />
            </div>
        </div>
    );
};
