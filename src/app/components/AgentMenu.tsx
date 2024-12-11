import React, { useEffect, useRef } from 'react';
import { AgentCard } from './AgentCard';
import { useAssistants } from '@/contexts/AssistantContext';
import { XMarkIcon } from '@heroicons/react/24/solid';


interface AgentDetails {
    assistantId: string;
    name: string;
    description: string;
    systemPrompt: string;
}


interface AgentMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STORED_AGENT_ID: string = "agent_id";


export const AgentMenuModal: React.FC<AgentMenuModalProps> = ({ isOpen, onClose }) => {
    const { agents, setAgentId } = useAssistants();
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

    const handleAgentChoice = (assistantId: string) => {
        setAgentId(assistantId);
        localStorage.setItem(STORED_AGENT_ID, assistantId);
        onClose();
    }

    if (!isOpen) return null;
    return (
        <>(<div className='p-4 pb-8 h-screen m-2 fixed inset-0 bg-default-background backdrop-blur-sm items-center justify-center z-50 overflow-y-auto overscroll-contain'>
            <div className='flex flex-col items-center justify-center overflow-y-auto p-4'>

                <span className="text-brand-primary text-md py-2 pr-2 rounded leading-tight">AI Assistant Menu</span>
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-brand-primary hover:text-white transition-colors duration-300"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className='h-screen overflow-y-auto'>
                    <div className='flex flex-col items-center justify-center overflow-y-auto'>
                        {agentList.map((a) => {
                            return (
                                <div key={a.assistantId} className='w-full'>
                                    <AgentCard agent={a} onClick={handleAgentChoice} />
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
