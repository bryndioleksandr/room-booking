import React from "react";

interface ModalProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
    contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
    title,
    description,
    children,
    onClose,
    className,
    contentClassName = "p-6",
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                className={`relative bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-lg ${
                    className || ""
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || description) && (
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between">
                        <div>
                            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                            {description && (
                                <p className="text-sm text-gray-600 mt-1">{description}</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                <div className={contentClassName}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;

