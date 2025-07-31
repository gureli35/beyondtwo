    import React, { useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { 
    CheckCircleIcon, 
    ExclamationCircleIcon, 
    InformationCircleIcon, 
    XMarkIcon 
} from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    type: ToastType;
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({ type, message, show, onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            
            return () => clearTimeout(timer);
        }
    }, [show, onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />;
            case 'error':
                return <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />;
            case 'warning':
                return <ExclamationCircleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />;
            case 'info':
                return <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <Transition
                show={show}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden border ${getBgColor()}`}>
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {getIcon()}
                            </div>
                            <div className={`ml-3 w-0 flex-1 pt-0.5 ${getTextColor()}`}>
                                <p className="text-sm font-medium">{message}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className={`bg-transparent rounded-md inline-flex ${getTextColor()} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
}
