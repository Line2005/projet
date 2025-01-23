import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Dialog.Content className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md ${className}`}>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export const DialogHeader = ({ children, className = '' }) => {
    return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const DialogFooter = ({ children, className = '' }) => {
    return <div className={`mt-6 flex justify-end gap-3 ${className}`}>{children}</div>;
};

export const DialogTitle = ({ children, className = '' }) => {
    return <Dialog.Title className={`text-lg font-semibold ${className}`}>{children}</Dialog.Title>;
};

export const DialogContent = ({ children, className = '' }) => {
    return <div className={`${className}`}>{children}</div>;
};

export { Modal as Dialog };