"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import React from "react";
import NotesPanel from "./NotesPanel";
import ThreadList from "./ThreadList";

export const Sidebar: React.FC = () => {
	return (
		<div className="h-screen bg-gray-200 transition-all duration-300 w-96 min-w-96 mt-8 sm:mt-2 lg:w-96 md:min-w-72">
			<div className=" flex flex-1 w-full flex-col items-center justify-center mt-6 px-2 py-4">
				<NotesPanel />
				<ThreadList />
			</div>
		</div>
	);
};
