import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { CogIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface AgentDetails {
    assistantId: string;
    name: string;
    description: string;
    systemPrompt: string;
}

interface EditProps {
    agent: AgentDetails;
}

interface AgentMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AgentMenuModal: React.FC<AgentMenuModalProps> = ({ isOpen, onClose }) => {
    const { agents, setAgentId } = useChat();
    const agentList: AgentDetails[] = agents.map((a: AgentProps) => {
        const agent: AgentDetails = {
            assistantId: a.assistant_id,
            name: a.name,
            systemPrompt: a.system_prompt,
            description: a.description ? a.description : ""
        }
        return agent;
    });

    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        };

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return (
        <>(<div className='p-4 py-8 m-2 fixed inset-0 bg-default-background backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto'>
            <div className='flex flex-col items-center justify-center p-4'>

                <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">AI Assistant Menu</span>
                <div className='grid-cols-1 sm:grid-cols-2 md:grid-cols-3 overflow-y-auto'>
                    <div className='flex flex-col items-center justify-center'>
                        {agentList.map((a) => {
                            return (
                                <div className='flex justify-between items-start w-full p-2 bg-brand-50/50 rounded-md my-1'>
                                    <div className='flex flex-col items-start flex-1'>
                                        <span className='text-default-font text-xl py-2 pr-2 rounded leading-tight' >
                                            {a.name}
                                        </span>
                                        <span className='text-default-font text-md py-2 pr-2 rounded leading-tight' >
                                            {a.description}
                                        </span>
                                    </div>
                                    <EditAgent agent={a} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>)
        </>
    )
}


const EditAgent: React.FC<EditProps> = ({ agent }) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [detailsToUpdate, setDetailsToUpdate] = useState<AgentDetails>({ ...agent });

    const handleOpenEdit = () => setEditing(true);
    const handleCloseEdit = () => setEditing(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDetailsToUpdate(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Agent details updated:', detailsToUpdate);
        // Here you would typically send the data to your backend or state management
        handleCloseEdit();
    };

    return (
        <>
            {editing ? (<div className=''>
                <button
                    onClick={() => handleCloseEdit()}
                    className="absolute top-8 right-8 text-brand-primary hover:text-white transition-colors duration-300"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="assistantId" className="block text-sm font-medium text-brand-primary font-mono">
                            Assistant ID
                        </label>
                        <input
                            type="text"
                            id="assistantId"
                            name="assistantId"
                            value={detailsToUpdate.assistantId}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-neutral-50 border border-brand-primary rounded-md text-default-font font-mono focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-primary font-mono">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={detailsToUpdate.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-neutral-50 border border-brand-primary rounded-md text-default-font font-mono focus:outline-none focus:ring-2 focus:ring-brand-800"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-primary font-mono">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={detailsToUpdate.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 bg-neutral-50 border border-brand-primary rounded-md text-neutral-700/60 font-mono focus:outline-none focus:ring-2 focus:ring-brand-800 resize-y"
                        />
                    </div>
                    <div>
                        <label htmlFor="systemPrompt" className="block text-sm font-medium text-brand-primary font-mono">
                            System Prompt
                        </label>
                        <textarea
                            id="systemPrompt"
                            name="systemPrompt"
                            value={detailsToUpdate.systemPrompt}
                            onChange={handleChange}
                            rows={5}
                            className="mt-1 block w-full px-3 py-2 bg-neutral-50 border border-brand-primary rounded-md text-default-background font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-100 text-default-font rounded-md hover:bg-brand-primary hover:text-black transition-colors duration-300 font-mono"
                        >
                            Save Agent
                        </button>
                    </div>
                </form>
            </div>) : (<div className='p-4 flex items-center justify-center'>
                <button
                    className="px-6 py-2 bg-brand-100 text-default-font rounded-md hover:bg-brand-primary hover:text-black transition-colors duration-300 font-mono"
                    onClick={() => handleOpenEdit()}
                >

                </button>
                <CogIcon />
            </div>)}
        </>
    );
};
