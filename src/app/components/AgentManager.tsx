import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import CreateAgentModal from './CreateAgentModal';
import { AgentMenuModal } from './AgentMenu';

const AgentManager: React.FC = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleOpenCreate = () => setIsCreateOpen(true);
    const handleCloseCreate = () => setIsCreateOpen(false);
    const handleOpenMenu = () => setIsMenuOpen(true);
    const handleCloseMenu = () => setIsMenuOpen(false);

    return (
        <>
            <div className='flex items-center justify-center space-x-2'>
                <button
                    onClick={handleOpenMenu}
                    className="flex items-center px-4 py-2 bg-brand-400/50 text-default-font rounded-md hover:bg-default-background transition-colors duration-300 font-mono"
                >
                    Agent Menu
                </button>
                <AgentMenuModal isOpen={isMenuOpen} onClose={handleCloseMenu} />
            </div>
            <div className='flex items-center justify-center space-x-2'>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center px-4 py-2 bg-brand-400/50 text-default-font rounded-md hover:bg-default-background transition-colors duration-300 font-mono"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Agent
                </button>

                <CreateAgentModal isOpen={isCreateOpen} onClose={handleCloseCreate} />
            </div>
        </>
    );
};

export default AgentManager;
