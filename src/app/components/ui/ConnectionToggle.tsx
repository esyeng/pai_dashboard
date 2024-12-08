import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";

export const ConnectionToggle: React.FC = () => {
    const { useWebSocket, toggleWebSocketMode } = useChat();

    return (<label className="relative inline-flex items-center cursor-pointer select-none">
        <input
            type="checkbox"
            className="sr-only peer"
            checked={useWebSocket}
            onChange={toggleWebSocketMode}
        />
        <div className="w-11 h-6 bg-neutral-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-400 rounded-full peer dark:bg-neutral-200 peer-checked:bg-brand-500 transition-colors duration-300 relative">
            <span
                className="absolute top-[2px] left-[2px] w-5 h-5 bg-default-background border border-neutral-600 rounded-full transition-all duration-300 transform peer-checked:translate-x-full peer-checked:border-white"
            />
        </div>
        <span className="ml-3 text-sm font-medium text-neutral-300">
            {useWebSocket ? "Connected" : "Disconnected"}
        </span>
    </label>)
}

