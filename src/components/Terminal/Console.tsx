// src/components/Terminal/Console.tsx
import React, { useEffect, useRef } from 'react';
import './Console.styles.css';

interface ConsoleProps {
    messages: string[];
}

const Console: React.FC<ConsoleProps> = ({ messages }) => {
    const consoleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="console" ref={consoleRef}>
            {messages.length === 0 ? (
                <div className="console-line">
                    <span className="console-time">[00:00:00]</span>
                    <span className="console-message">System initialized. Awaiting input...</span>
                </div>
            ) : (
                messages.map((message, index) => {
                    const [time, ...rest] = message.split('] ');
                    const msg = rest.join('] ');
                    const isError = msg.includes('ERROR');
                    const isAlert = msg.includes('ALERT');

                    return (
                        <div key={index} className="console-line">
                            <span className="console-time">{time}]</span>
                            <span className={`console-message ${isError ? 'error' : isAlert ? 'alert' : ''}`}>
                                {msg}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Console;