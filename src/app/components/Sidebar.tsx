"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import React, { useState } from "react";
import NotesPanel from "./NotesPanel";
import ThreadList from "./ThreadList";

export const Sidebar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(true);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div
			className={`fixed top-0 left-0 h-screen bg-gray-200 transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}
		>
			<button
				className="absolute top-4 right-4 p-2 bg-gray-300 rounded-md focus:outline-none"
				onClick={toggleSidebar}
			>
				{isOpen ? "×" : "☰"}
			</button>
			<div className={`p-4 ${isOpen ? "block" : "hidden"}`}>
				<NotesPanel />
				<ThreadList />
			</div>
		</div>
	);
};
