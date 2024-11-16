import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import CreateAgentModal from './CreateAgentModal';

const AgentManager: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div>
            <button
                onClick={handleOpenModal}
                className="flex items-center px-4 py-2 bg-[#0d5c63] text-white rounded-md hover:bg-[#094249] transition-colors duration-300 font-mono"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Agent
            </button>

            <CreateAgentModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default AgentManager;
