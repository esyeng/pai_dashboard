import React, { useState } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/solid';
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
        <div className='w-full my-1 flex items-center justify-center space-x-4 flex-1 lg:space-x-0 lg:flex-col lg:space-y-2'>
            <div className='w-full flex items-center justify-center space-x-4'>
                <button
                    onClick={handleOpenMenu}
                    className="w-full flex items-center px-4 py-2 bg-brand-400/50 text-default-font rounded-md hover:bg-default-background transition-colors duration-300 lg:text-xs lg:px-2 min-w-10 lg:max-w-44 self-stretch"
                >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    <span className='self-stretch'>

                        Agent Menu
                    </span>
                </button>
                <AgentMenuModal isOpen={isMenuOpen} onClose={handleCloseMenu} />
            </div>
            <div className='w-full flex items-center justify-center space-x-2'>

                <button
                    onClick={handleOpenCreate}
                    className="w-full flex items-center px-4 py-2 bg-brand-400/50 text-default-font rounded-md hover:bg-default-background transition-colors duration-300 lg:text-xs lg:px-2 min-w-10 lg:max-w-44 self-stretch"
                >
                    <PlusIcon className="w-5 h-5 mr-2 md:mr-0" />
                    <span>
                        Create Agent
                    </span>
                </button>

                <CreateAgentModal isOpen={isCreateOpen} onClose={handleCloseCreate} />
            </div>
        </div>
    );
};

export default AgentManager;


// const tooltipClass = "lg:absolute lg:group-hover:flex lg:-left-5 lg:-top-2 lg:-translate-y-full lg:w-48 lg:px-2 lg:py-1 lg:bg-gray-700 lg:rounded-lg lg:text-center lg:text-white lg:text-sm lg:after:content-[''] lg:after:absolute after:left-1/2 lg:after:top-[100%] lg:after:-translate-x-1/2 lg:after:border-8 lg:after:border-x-transparent lg:after:border-b-transparent lg:after:border-t-gray-700 lg:hidden"
