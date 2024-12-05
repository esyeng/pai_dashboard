import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

type StatusProps = {
    status: 'idle' | 'loading' | 'success' | 'error' | 'info';
    message: string;
    duration?: number;
    onClose?: () => void;
};

export const StatusCard: React.FC<StatusProps> = ({ status, message, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (status !== 'loading' && status !== 'idle') {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose && onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [status, duration, onClose]);

    if (status === 'idle' || !isVisible) return null;

    const getStatusColor = () => {
        switch (status) {
            case 'loading': return 'bg-brand-600 text-neutral-950';
            case 'success': return 'bg-success-600 text-neutral-950';
            case 'error': return 'bg-error-600 text-neutral-950';
            case 'info': return 'bg-vista-blue text-neutral-950';
            default: return 'bg-neutral-600 text-neutral-950';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'loading': return <InformationCircleIcon className="w-5 h-5 animate-spin" />;
            case 'success': return <CheckCircleIcon className="w-5 h-5" />;
            case 'error': return <XCircleIcon className="w-5 h-5" />;
            case 'info': return <InformationCircleIcon className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`flex items-center p-4 rounded-md shadow-md ${getStatusColor()} transition-all duration-300 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                <div className="flex-shrink-0 mr-3">
                    {getStatusIcon()}
                </div>
                <div className="flex-1 max-w-xs">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose && onClose();
                    }}
                    className="ml-4 flex-shrink-0 text-neutral-950 hover:text-neutral-800 focus:outline-none"
                >
                    <XCircleIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
