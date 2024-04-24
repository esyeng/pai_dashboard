'use client';

import React from 'react';
import { useChat } from '../../contexts/ChatContext';

export const AgentDropdown: React.FC = () => {
  const { agentId, setAgentId } = useChat();

  const agents = [
    { id: 'tutor', name: 'Tutor' },
    { id: 'coder', name: 'Coder' },
    { id: 'ada', name: 'Ada' },
    { id: 'fed', name: 'FED' },
  ];

  const handleAgentChange = (selectedAgentId: string) => {
    setAgentId(selectedAgentId);
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={agentId}
        onChange={(e) => handleAgentChange(e.target.value)}
        className="block appearance-none w-full bg-[#289DA8] border border-[#5fbb97] text-[#9de6ca] py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5fbb97]">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z" />
        </svg>
      </div>
    </div>
  );
};
