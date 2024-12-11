import React, { useState, useEffect, useRef } from 'react';
import { updateThreadName } from '@/lib/api';
import { useChat } from '@/contexts/ChatContext';

interface ThreadTitleEditorProps {
    thread: Thread;
    onClick: () => void;
}

export const ThreadTitleEditor: React.FC<ThreadTitleEditorProps> = ({ thread, onClick }) => {
    const originalTitle = thread.title;
    const spanRef = useRef<HTMLSpanElement>(null);
    const { threadState: { currentThreadId }, dispatchThreads } = useChat();

    useEffect(() => {
        if (spanRef.current) {
            spanRef.current.textContent = originalTitle;
        }
    }, [originalTitle]);


    const handleTitleChange = (event: React.FormEvent<HTMLSpanElement>) => {
        const target = event.target as HTMLSpanElement;
        target.style.width = `${target.scrollWidth}px`;
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            (event.target as HTMLSpanElement).blur();
        }
    };

    const handleBlur = async (event: React.FocusEvent<HTMLSpanElement>) => {
        const target = event.target as HTMLSpanElement;
        const trimmed = target.textContent?.trim() ?? "";
        if (trimmed && trimmed !== thread.title) {
            const id = thread.thread_id ?? thread.threadId;
            if (!id) {
                console.error("Thread ID not found");
                return;
            }
            await updateThreadName(id, trimmed);
            console.log("call to backend: update thread name");

            dispatchThreads({
                type: 'UPDATE_THREAD',
                payload: {
                    threadId: id,
                    updates: { title: trimmed }
                }
            });
        }
    };

    return (
        <span
            ref={spanRef}
            contentEditable={thread.name_editable ? "true" : "false"}
            suppressContentEditableWarning
            onInput={handleTitleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${currentThreadId === thread.threadId || currentThreadId === thread.thread_id ? "bg-brand-600 text-default-font border-brand-800" : "bg-neutral-50 text-brand-600 border-brand-400 hover:bg-brand-400  hover:text-black "}  border-y-2 flex-1 font-bold self-stretch rounded-tl-sm rounded-bl-sm  py-4 pl-2 pr-1 cursor-pointer duration-300 `}
            onClick={onClick}
        />
    );
};

