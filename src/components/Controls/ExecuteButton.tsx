// src/components/Controls/ExecuteButton.tsx
import React from 'react';

interface ExecuteButtonProps {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    tokenAddress: string;
}

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
                                                         onClick,
                                                         disabled = false,
                                                         loading = false,
                                                         tokenAddress
                                                     }) => {
    const getButtonText = () => {
        if (loading) {
            return '⚡ EXECUTING...';
        }
        if (!tokenAddress) {
            return '🔍 ENTER TOKEN ADDRESS';
        }
        return '🚀 EXECUTE SCAN';
    };

    const isDisabled = disabled || !tokenAddress || loading;

    return (
        <button
            className={`execute-button ${loading ? 'loading' : ''}`}
            onClick={onClick}
            disabled={isDisabled}
            type="button"
        >
            {getButtonText()}
        </button>
    );
};

export default ExecuteButton;