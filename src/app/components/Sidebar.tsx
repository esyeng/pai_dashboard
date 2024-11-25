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
        <div className={`top-0 left-0 h-screen ease-in-out duration-300 bg-caribbean-current ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:w-1/4 sm:h-full sm:fixed`}>
            <div className="">
                <NotesPanel />
                <ThreadList />
                <div className="flex justify-center items-center px-2 my-1 mx-4">

                    <button
                        onClick={toggleSearchOptions}
                        className={`${shouldQueryResearchModel ? " text-mint " : " bg-gradient-to-b from-[#4ce6ab2d] to-[#0ea46a3b] text-mint"} p-1 mt-8 mb-4 rounded font-mono border shadow leading-tight duration-200 w-full  border-gray-200 resize-y hover:text-[#fff] hover:bg-gradient-to-b hover:from-[#4ce6ab2d] hover:to-[#0ea46a3b]`}
                    >
                        Toggle Search Options
                    </button>
                </div>
                {shouldQueryResearchModel &&
                    (<div className={`mb-2 pb-2 px-8 w-full transition-all duration-700 ease-in-out overflow-scroll ${shouldQueryResearchModel ? 'max-h-screen' : 'max-h-0'}`}>
                        <SearchOptions />
                    </div>
                    )}
            </div>
        </div>
    );
};
