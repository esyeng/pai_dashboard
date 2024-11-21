import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface AgentFormData {
    assistantId: string;
    name: string;
    description: string;
    systemPrompt: string;
}

interface CreateAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<AgentFormData>({
        assistantId: '',
        name: '',
        description: '',
        systemPrompt: '',
    });

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        // Here you would typically send the data to your backend or state management
        onClose();
    };
    if (!isOpen) return null;
    return (
        <>
            (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div ref={modalRef} className="bg-[#151515] p-8 rounded-lg w-full max-w-md relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#9de6ca] hover:text-white transition-colors duration-300"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold mb-6 text-[#9de6ca] font-mono">Create Agent</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="assistantId" className="block text-sm font-medium text-[#9de6ca] font-mono">
                                Assistant ID
                            </label>
                            <input
                                type="text"
                                id="assistantId"
                                name="assistantId"
                                value={formData.assistantId}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-[#1e1e1e] border border-[#0d5c63] rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#9de6ca]"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#9de6ca] font-mono">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-[#1e1e1e] border border-[#0d5c63] rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#9de6ca]"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-[#9de6ca] font-mono">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 bg-[#1e1e1e] border border-[#0d5c63] rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#9de6ca] resize-y"
                            />
                        </div>
                        <div>
                            <label htmlFor="systemPrompt" className="block text-sm font-medium text-[#9de6ca] font-mono">
                                System Prompt
                            </label>
                            <textarea
                                id="systemPrompt"
                                name="systemPrompt"
                                value={formData.systemPrompt}
                                onChange={handleChange}
                                rows={5}
                                className="mt-1 block w-full px-3 py-2 bg-[#1e1e1e] border border-[#0d5c63] rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#9de6ca] resize-y"
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#0d5c63] text-white rounded-md hover:bg-[#094249] transition-colors duration-300 font-mono"
                            >
                                Save Agent
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            )
        </>
    );
};

export default CreateAgentModal;
