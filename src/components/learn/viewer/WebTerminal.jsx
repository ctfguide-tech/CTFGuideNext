'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const WebTerminal = () => {
    const [isBooting, setIsBooting] = useState(false);
    const [error, setError] = useState(null);
    const terminalRef = useRef(null);
    const webcontainerRef = useRef(null);
    const terminalInstanceRef = useRef(null);

    const initializeEnvironment = async () => {
        if (typeof window === 'undefined') return;

        if (!window.crossOriginIsolated) {
            setError('Cross-origin isolation is not enabled. WebContainer requires this to function.');
            return;
        }

        setIsBooting(true);
        try {
            // Dynamically import WebContainer only in browser
            const { WebContainer } = await import('@webcontainer/api');
            const webcontainer = await WebContainer.boot();
            webcontainerRef.current = webcontainer;

            // Set up basic Ubuntu-like environment
            await webcontainer.mount({
                'setup.sh': {
                    file: {
                        contents: `
                            apt-get update
                            apt-get install -y vim nano git python3 curl
                            echo "root:root" | chpasswd
                            echo "PS1='\\u@\\h:\\w\\$ '" >> ~/.bashrc
                        `
                    }
                }
            });

            // Initialize terminal
            const terminal = new Terminal({
                cursorBlink: true,
                fontSize: 14,
                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                theme: {
                    background: '#1a1b1e'
                }
            });

            terminal.open(terminalRef.current);
            terminalInstanceRef.current = terminal;

            // Start shell process
            const shellProcess = await webcontainer.spawn('bash', {
                terminal: {
                    cols: terminal.cols,
                    rows: terminal.rows
                }
            });

            // Connect terminal to shell
            terminal.onData((data) => {
                shellProcess.write(data);
            });

            // Pipe shell output to terminal
            shellProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        terminal.write(data);
                    }
                })
            );

            // Run initial setup
            await webcontainer.spawn('bash', ['setup.sh']);

        } catch (error) {
            console.error('Failed to initialize environment:', error);
            setError(error.message);
        } finally {
            setIsBooting(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (webcontainerRef.current) {
                webcontainerRef.current.teardown();
            }
        };
    }, []);

    return (
        <div className="h-full bg-neutral-900">
            {error ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-red-400">
                        <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                        <p>{error}</p>
                    </div>
                </div>
            ) : isBooting ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin text-4xl mb-4">⚙️</div>
                        <p className="text-neutral-400">Booting Ubuntu-like environment...</p>
                        <p className="text-xs text-neutral-500 mt-2">This might take a few seconds</p>
                    </div>
                </div>
            ) : !webcontainerRef.current ? (
                <div className="flex items-center justify-center h-full">
                    <button
                        onClick={initializeEnvironment}
                        className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Start Terminal Environment
                    </button>
                </div>
            ) : (
                <div 
                    ref={terminalRef} 
                    className="h-full p-4"
                    style={{ backgroundColor: '#1a1b1e' }}
                />
            )}
        </div>
    );
};

export default WebTerminal; 