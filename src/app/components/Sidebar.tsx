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
        <div className="h-screen bg-gray-200 transition-all duration-300 w-96 min-w-96 mt-8 sm:mt-2 lg:w-96 md:min-w-72">
            <div className=" flex flex-1 w-full flex-col items-center justify-center mt-6 px-2 py-4">

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
