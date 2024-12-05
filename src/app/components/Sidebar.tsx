"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import React from "react";
import NotesPanel from "./NotesPanel";
import ThreadList from "./ThreadList";
import { SignInOrOut } from "./account/SignInOrOut";
import { SearchOptions } from "./SearchOptions";
import { useChat } from "@/contexts/ChatContext";
import { useSidebar } from "@/lib/hooks/use-sidebar";

export const Sidebar: React.FC = () => {
    const { isSidebarOpen } = useSidebar();
    const { shouldQueryResearchModel, setShouldQueryResearchModel } = useChat();

    const toggleSearchOptions = () => {
        setShouldQueryResearchModel(!shouldQueryResearchModel);
    }

    return (
        <div className={`top-0 left-0 px-2 h-screen ease-in-out duration-300 bg-default-background ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto sm:w-1/4 sm:h-full sm:fixed sm:mb-28`}>
            <div className="">

                <div className="flex justify-center items-center px-2 my-1 ">

                    <button
                        onClick={toggleSearchOptions}
                        className={`${shouldQueryResearchModel ? " text-default-font/70 " : "  bg-brand-50 "}border border-brand-primary  p-1 py-2 mt-8 mb-4  text-default-font/70 rounded-sm leading-tight duration-200 w-full  resize-y  hover:bg-brand-300`}
                    >
                        Toggle Search Options
                    </button>
                </div>
                {shouldQueryResearchModel &&
                    (<div className={`mb-2 pb-2 px-2 w-full overflow-y-auto transition-all duration-700 ease-in-out  ${shouldQueryResearchModel ? 'max-h-screen' : 'max-h-0'}`}>
                        <SearchOptions />
                    </div>
                    )}
                <div className="mx-1">

                    <NotesPanel />
                    <ThreadList />
                </div>
                <div className="flex h-24 mb-8 flex-col items-center justify-center">
                    <div className="w-full ">
                        <SignInOrOut />
                    </div>

                </div>
            </div>
        </div>
    );
};
