import React, { useState } from 'react';
import { WrenchIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAssistants } from '@/contexts/AssistantContext';
import { useJasmynAuth } from '@/contexts/AuthContext';
import { StatusCard } from './StatusCard';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface AgentDetails {
    assistantId: string;
    name: string;
    description: string;
    systemPrompt: string;
}

interface EditProps {
    agent: AgentDetails;
    onClick: (id: string) => void;
}

export const AgentCard: React.FC<EditProps> = ({ agent, onClick }) => {
    const { saveAssistantUpdates, runDeleteAssistant, status, statusMessage } = useAssistants();
    const { user } = useJasmynAuth()
    const [editing, setEditing] = useState<boolean>(false);
    const [detailsToUpdate, setDetailsToUpdate] = useState<AgentDetails>({ ...agent });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

    const handleOpenEdit = () => setEditing(true);
    const handleCloseEdit = () => setEditing(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDetailsToUpdate(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Agent details updated:', detailsToUpdate);
        const { name, systemPrompt, description } = detailsToUpdate;
        await saveAssistantUpdates(user?.user_id, agent.assistantId, name, systemPrompt, description);
        handleCloseEdit();
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        console.log("Executing delete agent...");
        await runDeleteAssistant(agent.assistantId, user?.user_id);
        setIsDeleteDialogOpen(false);

    }

    return (
        <>
            <div className={`flex ${editing ? "flex-col" : "flex-row"} justify-between items-start w-full p-2 bg-brand-50/50 rounded-md my-1 cursor-pointer hover:bg-brand-50`}>
                <div className='flex justify-end items-center w-full'>
                    {status !== 'idle' && <StatusCard status={status} message={statusMessage} />}
                    <div className='flex flex-col items-start flex-1' onClick={() => onClick(agent.assistantId)}>
                        <span className='text-default-font text-xl py-2 pr-2 rounded leading-tight' >
                            {agent.name}
                        </span>
                        <span className='text-default-font text-md py-2 pr-2 rounded leading-tight' >
                            {agent.description}
                        </span>
                    </div>
                    <div className='p-4 flex items-center justify-end'>
                        <div className={`flex items-center justify-between ${editing ? "self-end" : ""}`}>
                            <button
                                className="p-2 text-default-font rounded-md hover:bg-default-background hover:text-black transition-colors duration-300 font-mono"
                                onClick={() => {
                                    if (!editing) {
                                        handleOpenEdit();
                                    }
                                    else {
                                        handleCloseEdit();
                                    }
                                }
                                }
                            >
                                {editing ? (<XMarkIcon fill="grey" className="w-6 h-6" />) : (<WrenchIcon fill="grey" className='h-6 w-6' />)}
                            </button>
                            <button
                                className="p-2 text-default-font rounded-md hover:bg-default-background hover:text-black transition-colors duration-300 font-mono"
                                onClick={handleDeleteClick}
                            >
                                <TrashIcon fill="grey" className='h-6 w-6' />
                            </button>
                            <DeleteConfirmationDialog
                                isOpen={isDeleteDialogOpen}
                                onClose={() => setIsDeleteDialogOpen(false)}
                                onConfirm={handleDeleteConfirm}
                                assistantId={agent.assistantId}
                            />

                        </div>
                    </div>
                </div>
                {editing ? (<div className='flex flex-col w-full'>
                    <div className='flex items-center space-x-2 my-1'>
                        <span className="block text-xs font-medium text-brand-primary font-mono">
                            Assistant ID:
                        </span>
                        <span className="block text-sm font-medium text-default-font font-mono">
                            {agent.assistantId}
                        </span>

                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                className="mt-1 block w-full px-3 py-2 bg-neutral-50 border border-brand-primary rounded-md text-default-font font-mono focus:outline-none focus:ring-2 focus:ring-brand-800 resize-y"
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
                                className="mt-1 block w-full px-3 py-2 bg-neutral-50 border border-brand-primary rounded-md text-default-font font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-brand-200 border-2 border-brand-primary text-default-font rounded-md hover:bg-brand-primary hover:text-black transition-colors duration-300 font-mono"
                            >
                                Save Agent
                            </button>
                        </div>
                    </form>
                </div>) : null}
            </div>
        </>
    );
};
