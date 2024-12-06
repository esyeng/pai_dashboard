import React from 'react';

const MessageLoadingIndicator: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 bg-brand-200 rounded-3xl shadow-xl px-4 py-2 w-20 h-16 my-2 ">
            <div className="animate-bounce w-2 h-2 bg-[#848484] rounded-full" style={{ animationDelay: '0ms' }}></div>
            <div className="animate-bounce w-2 h-2 bg-[#848484] rounded-full" style={{ animationDelay: '150ms' }}></div>
            <div className="animate-bounce w-2 h-2 bg-[#848484] rounded-full" style={{ animationDelay: '300ms' }}></div>
        </div>
    );
};

export default MessageLoadingIndicator;
