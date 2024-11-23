"use client";

import React, { useState, useEffect, useCallback } from "react";


interface WSProps {
    url: string;
    route: string;
}


export const WebSocketManager: React.FC<WSProps> = ({ url, route }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");

    useEffect(() => {
        const ws: WebSocket = new WebSocket(`${url}${route}/ws`);

        ws.onopen = () => {
            console.log("connected");
        };

        ws.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.onclose = () => {
            console.log("disconnected");
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = useCallback(() => {
        if (socket) {
            socket.send(inputMessage);
            setInputMessage("");
        }
    }, [socket, inputMessage]);
    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
        </div>
    )
}
