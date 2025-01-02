import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { WebContainer } from '@webcontainer/api';
// Dynamic import of MonacoEditor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false
});

const renderComponent = (component) => {
    if (!component || !component.type) {
        console.error('Invalid component:', component);
        return null;
    }

    switch (component.type.toLowerCase()) {
        case 'markdown':
            return (
                <div className="mb-8 bg-neutral-800/40 rounded-xl border border-neutral-700/30 overflow-hidden">
                    <div className="prose prose-invert prose-sm max-w-none p-6">
                        <MarkdownViewer content={component.content} />
                    </div>
                </div>
            );

        case 'multiple-choice':
            return (
                <MultipleChoiceQuestion 
                    question={component.content}
                    options={component.config?.options || []}
                    correctAnswer={component.config?.correctAnswer}
                />
            );

        case 'code':
            return (
                <CodeExecutor
                    initialCode={component.content}
                    language={component.config?.language || 'python'}
                    testCases={component.config?.testCases || []}
                />
            );

        default:
            console.warn('Unknown component type:', component.type);
            return (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    <p>Unknown component type: {component.type}</p>
                    <pre className="mt-2 text-xs">
                        {JSON.stringify(component, null, 2)}
                    </pre>
                </div>
            );
    }
};

const MultipleChoiceQuestion = ({ question, options, correctAnswer }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            setHasSubmitted(true);
        }
    };

    return (
        <div className="mb-8 bg-neutral-800/40 rounded-xl border border-neutral-700/30 overflow-hidden">
            <div className="p-6">
                <h3 className="text-lg font-medium mb-4">{question}</h3>
                <div className="space-y-3">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => !hasSubmitted && setSelectedAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg transition-all ${
                                selectedAnswer === index
                                    ? 'bg-blue-500/20 border border-blue-500/50'
                                    : 'bg-neutral-900/50 border border-neutral-700/30 hover:border-blue-500/30'
                            } ${
                                hasSubmitted && index === correctAnswer
                                    ? 'bg-green-500/20 border-green-500/50'
                                    : hasSubmitted && index === selectedAnswer
                                    ? 'bg-red-500/20 border-red-500/50'
                                    : ''
                            }`}
                            disabled={hasSubmitted}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {!hasSubmitted && (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="mt-4 px-6 py-2 bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        Submit Answer
                    </button>
                )}
                {hasSubmitted && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        selectedAnswer === correctAnswer
                            ? 'bg-green-500/20 border border-green-500/50'
                            : 'bg-red-500/20 border border-red-500/50'
                    }`}>
                        {selectedAnswer === correctAnswer
                            ? 'Correct! Well done!'
                            : `Incorrect. The correct answer was: ${options[correctAnswer]}`}
                    </div>
                )}
            </div>
        </div>
    );
};

const CodeExecutor = ({ initialCode, language }) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const webcontainerRef = useRef(null);
    const currentProcessRef = useRef(null);

    const cleanupWebContainer = async () => {
        try {
            // Kill current process if it exists
            if (currentProcessRef.current) {
                try {
                    await currentProcessRef.current.kill();
                } catch (e) {
                    console.log('Process already terminated');
                }
                currentProcessRef.current = null;
            }

            // Teardown existing WebContainer
            if (webcontainerRef.current) {
                try {
                    await webcontainerRef.current.teardown();
                } catch (e) {
                    console.log('WebContainer already torn down');
                }
                webcontainerRef.current = null;
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    };

    const initializeWebContainer = async () => {
        // Clean up any existing instances first
        await cleanupWebContainer();

        setIsInitializing(true);
        try {
            const container = await WebContainer.boot();
            webcontainerRef.current = container;
            
            // Set up basic file system
            await container.mount({
                'index.js': {
                    file: {
                        contents: '',
                    },
                },
            });
            
            return container;
        } catch (error) {
            console.error('Failed to initialize WebContainer:', error);
            setOutput('Error: Failed to initialize code execution environment');
            throw error;
        } finally {
            setIsInitializing(false);
        }
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('');

        try {
            const webcontainer = await initializeWebContainer();

            // Handle different languages
            switch (language.toLowerCase()) {
                case 'javascript':
                case 'js':
                    await webcontainer.fs.writeFile('index.js', code);
                    currentProcessRef.current = await webcontainer.spawn('node', ['index.js']);
                    await handleProcessOutput(currentProcessRef.current);
                    break;

                case 'bash':
                case 'shell':
                    await webcontainer.fs.writeFile('script.sh', code);
                    currentProcessRef.current = await webcontainer.spawn('bash', ['script.sh']);
                    await handleProcessOutput(currentProcessRef.current);
                    break;

                case 'python':
                    await webcontainer.fs.writeFile('script.py', code);
                    await installDependency(webcontainer, 'python3');
                    currentProcessRef.current = await webcontainer.spawn('python3', ['script.py']);
                    await handleProcessOutput(currentProcessRef.current);
                    break;

                default:
                    setOutput(`Unsupported language: ${language}`);
                    break;
            }
        } catch (error) {
            setOutput('Error executing code: ' + error.message);
        } finally {
            setIsRunning(false);
            currentProcessRef.current = null;
        }
    };

    const handleProcessOutput = async (process) => {
        let outputText = '';
        
        process.output.pipeTo(
            new WritableStream({
                write(chunk) {
                    outputText += chunk;
                    setOutput(outputText);
                },
            })
        );

        process.stderr.pipeTo(
            new WritableStream({
                write(chunk) {
                    outputText += chunk;
                    setOutput(outputText);
                },
            })
        );

        const exitCode = await process.exit;
        if (exitCode !== 0) {
            setOutput(prev => prev + '\nProcess exited with code ' + exitCode);
        }
    };

    const installDependency = async (webcontainer, packageName) => {
        try {
            const installProcess = await webcontainer.spawn('apt-get', ['install', '-y', packageName]);
            await handleProcessOutput(installProcess);
        } catch (error) {
            console.error(`Failed to install ${packageName}:`, error);
            throw error;
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            cleanupWebContainer();
        };
    }, []);

    return (
        <div className="mb-8 bg-neutral-800/40 rounded-xl border border-neutral-700/30 overflow-hidden">
            <div className="border-b border-neutral-700/30 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <i className={`fab fa-${language} text-blue-400`}></i>
                    <span className="text-sm font-medium">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
                </div>
                <button
                    onClick={handleRunCode}
                    disabled={isRunning || isInitializing}
                    className="px-4 py-2 bg-green-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                    {isInitializing ? (
                        <>
                            <i className="fas fa-cog fa-spin"></i>
                            <span>Initializing...</span>
                        </>
                    ) : isRunning ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin"></i>
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-play"></i>
                            <span>Run Code</span>
                        </>
                    )}
                </button>
            </div>
            <div className="p-4">
                <MonacoEditor
                    height="200px"
                    language={language}
                    value={code}
                    onChange={setCode}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                    }}
                />
                {output && (
                    <div className="mt-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-700/30">
                        <pre className="text-sm text-white">{output}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

const CompletionScreen = ({ onRestart }) => {
    const { width, height } = useWindowSize();
    const [isConfettiActive, setIsConfettiActive] = useState(true);

    useEffect(() => {
        // Stop confetti after 5 seconds
        const timer = setTimeout(() => setIsConfettiActive(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
            {isConfettiActive && <ReactConfetti width={width} height={height} />}
            <div className="max-w-lg w-full mx-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 border border-neutral-700/50 shadow-2xl"
                >
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center"
                        >
                            <i className="fas fa-check text-3xl text-white"></i>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold mt-6 mb-2"
                        >
                            Lesson Completed! 🎉
                        </motion.h2>
                        
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-neutral-400 mb-8"
                        >
                            Congratulations! You've successfully completed this lesson.
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-2 gap-4 mb-8"
                        >
                            <div className="bg-neutral-800/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-green-400">100%</div>
                                <div className="text-sm text-neutral-400">Completion</div>
                            </div>
                            <div className="bg-neutral-800/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-blue-400">+50</div>
                                <div className="text-sm text-neutral-400">XP Earned</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex space-x-4"
                        >
                            <button
                                onClick={onRestart}
                                className="flex-1 px-6 py-3 bg-neutral-700/50 hover:bg-neutral-700 rounded-xl transition-colors"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                Restart Lesson
                            </button>
                            <button
                                onClick={() => window.location.href = '/learn'}
                                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                            >
                                <i className="fas fa-arrow-right mr-2"></i>
                                Next Lesson
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const LessonViewer = ({ lessonData }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [loadError, setLoadError] = useState('');
    const [isChallengeFullscreen, setIsChallengeFullscreen] = useState(false);
    const [terminalUrl, setTerminalUrl] = useState('');
    const [isTerminalBooted, setIsTerminalBooted] = useState(false);
    const [fetchingTerminal, setFetchingTerminal] = useState(false);
    const [foundTerminal, setFoundTerminal] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [minutesRemaining, setMinutesRemaining] = useState(60);
    const [showMessage, setShowMessage] = useState(false);
    const [containerId, setContainerId] = useState(null);
    const [showCompletion, setShowCompletion] = useState(false);

    useEffect(() => {
        console.log('Initial lessonData:', lessonData);
        
        if (!lessonData) {
            console.warn('No lesson data provided');
            setPages([]);
            setIsLoading(false);
            return;
        }

        try {
            // If content is a string, parse it, otherwise use it directly
            let parsedContent;
            if (typeof lessonData === 'string') {
                parsedContent = JSON.parse(lessonData);
            } else {
                parsedContent = lessonData;
            }
            
            console.log('Parsed content:', parsedContent);

            // Check if we have a pages array directly in the content
            if (Array.isArray(parsedContent.pages)) {
                console.log('Setting pages from content:', parsedContent.pages);
                setPages(parsedContent.pages);
            } 
            // If the content itself is an array, use it as pages
            else if (Array.isArray(parsedContent)) {
                console.log('Setting pages from array:', parsedContent);
                setPages(parsedContent);
            }
            // If we have a single page structure
            else {
                console.log('Creating single page from content');
                setPages([{
                    id: 1,
                    title: parsedContent.title || "Lesson Content",
                    components: parsedContent.components || []
                }]);
            }
        } catch (error) {
            console.error('Error processing lesson data:', error);
            setPages([{
                id: 1,
                title: "Error Loading Content",
                components: []
            }]);
        }
        setIsLoading(false);
    }, [lessonData]);

    const handleLoadLesson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            if (!parsedJson.pages || !Array.isArray(parsedJson.pages)) {
                throw new Error('Invalid lesson format: missing pages array');
            }
            
            setPages(parsedJson.pages);
            setCurrentPageIndex(0);
            setShowLoadModal(false);
            setJsonInput('');
            setLoadError('');
        } catch (error) {
            setLoadError(error.message);
        }
    };

    const LoadLessonModal = () => (
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${
                showLoadModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } transition-opacity`}
            onClick={() => setShowLoadModal(false)}
        >
            <div 
                className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 w-full max-w-2xl m-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/50 -mx-6 -mt-6 px-6 py-4 rounded-t-xl flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Load Lesson</h3>
                    <button
                        onClick={() => setShowLoadModal(false)}
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="relative">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-64 bg-neutral-900/50 text-white p-4 rounded-xl border border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                            placeholder="Paste your lesson JSON here..."
                        />
                    </div>
                    
                    {loadError && (
                        <div className="text-red-400 text-sm flex items-center space-x-2">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{loadError}</span>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            onClick={() => setShowLoadModal(false)}
                            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLoadLesson}
                            disabled={!jsonInput.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                            <i className="fas fa-file-import"></i>
                            <span>Load Lesson</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleBootTerminal = async () => {
        setFetchingTerminal(true);
        try {
            const cookie = getCookie('idToken');
            const data = await api.buildDocketTerminal("lesson", cookie);
            
            if (data && data.url) {
                setPassword(data.terminalUserPassword);
                setUserName(data.terminalUserName);
                setContainerId(data.containerId);
                setFoundTerminal(true);
                
                // Set minutes based on user role
                try {
                    const accountResponse = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null);
                    setMinutesRemaining(accountResponse.role === 'PRO' ? 120 : 60);
                } catch (error) {
                    setMinutesRemaining(60);
                }

                setTimeout(() => {
                    setTerminalUrl(data.url);
                    setFetchingTerminal(false);
                    setIsTerminalBooted(true);
                    setShowMessage(true);
                }, 5000);
            } else {
                toast.error("Unable to create the terminal, please try again");
                setFetchingTerminal(false);
            }
        } catch (error) {
            toast.error("Error creating terminal: " + error.message);
            setFetchingTerminal(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const formatTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}:${mins.toString().padStart(2, '0')}`;
    };

    const handleNextPage = () => {
        if (currentPageIndex === pages.length - 1) {
            setShowCompletion(true);
        } else {
            setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1));
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!pages || pages.length === 0) {
        return <div>No content available</div>;
    }

    const currentPage = pages[currentPageIndex];
    console.log('Current page index:', currentPageIndex);
    console.log('Current page:', currentPage);
    console.log('Total pages:', pages.length);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-900 to-neutral-950 text-white">
            {/* Load Lesson Modal */}
            <LoadLessonModal />

            {/* Show completion screen when lesson is finished */}
            {showCompletion && (
                <CompletionScreen 
                    onRestart={() => {
                        setShowCompletion(false);
                        setCurrentPageIndex(0);
                    }}
                />
            )}

            {/* Main Content */}
            <div className="h-[calc(100vh-4rem)]">
                <div className="flex h-full">
                    {/* Left side - Lesson Content */}
                    <div className={`flex flex-col ${isChallengeFullscreen ? 'hidden md:flex' : 'flex'} w-1/2 p-10 overflow-y-auto`}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPageIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-2xl font-semibold mb-8">{currentPage?.title}</h2>
                                {currentPage?.components?.map((component, index) => (
                                    <motion.div
                                        key={`${currentPageIndex}-${component.id || index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {renderComponent(component)}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right side - Terminal */}
                    <div className={`flex flex-col ${!isChallengeFullscreen ? 'hidden md:flex' : 'flex'} w-1/2 bg-neutral-800 overflow-hidden`}>
                        <div className="grow bg-neutral-950 w-full overflow-hidden">
                            <div className="h-full">
                                {foundTerminal && (
                                    <div className="flex py-1 mb-4 text-xs">
                                        <h1 className="text-xs font-semibold py-2 pl-2">
                                            Username: {userName}
                                            <button onClick={() => copyToClipboard(userName)} className="ml-2 text-blue-500 hover:text-blue-300">
                                                <i className="fas fa-copy"></i>
                                            </button>
                                        </h1>
                                        <h1 className="text-xs font-semibold py-2 pl-2">
                                            Password: {password}
                                            <button onClick={() => copyToClipboard(password)} className="ml-2 text-blue-500 hover:text-blue-300">
                                                <i className="fas fa-copy"></i>
                                            </button>
                                        </h1>
                                        <h1 className="text-xs ml-auto px-4 font-semibold py-2 line-clamp-1 pl-2">
                                            Remaining Time: {formatTime(minutesRemaining)}
                                            <i onClick={() => window.open(terminalUrl, '_blank')} className="cursor-pointer hover:text-yellow-500 ml-2 fas fa-expand text-white"></i>
                                        </h1>
                                    </div>
                                )}

                                {fetchingTerminal ? (
                                    <div className="flex mx-auto text-center justify-center items-center h-full">
                                        <div>
                                            <h1 className="text-white text-4xl"><i className="fas fa-spinner fa-spin"></i></h1>
                                            <span className="text-white text-xl">Loading Terminal...</span>
                                            <p className="text-white text-lg">If you see a black screen, please wait a few seconds and refresh the page.</p>
                                        </div>
                                    </div>
                                ) : (
                                    isTerminalBooted ? (
                                        <iframe src={terminalUrl} className="pl-2 pb-10 w-full h-full overflow-hidden" />
                                    ) : (
                                        <div className="flex mx-auto text-center justify-center items-center h-full">
                                            <button
                                                onClick={handleBootTerminal}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Boot Terminal
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Mobile view toggle buttons */}
                        <button
                            onClick={() => setIsChallengeFullscreen(!isChallengeFullscreen)}
                            className="bg-neutral-700/50 hover:bg-neutral-700 text-white px-4 py-1 rounded mt-2 md:hidden"
                        >
                            <i className="fas fa-exchange-alt"></i> 
                            {isChallengeFullscreen ? ' Switch to Lesson' : ' Switch to Terminal'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Bar - Now at bottom */}
            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/90 border-t border-neutral-800/50 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-lg font-semibold">{currentPage?.title || 'Untitled Page'}</h1>
                            <div className="text-sm text-neutral-400">
                                Page {currentPageIndex + 1} of {pages.length}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowLoadModal(true)}
                                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
                            >
                                <i className="fas fa-file-import"></i>
                                <span>Load Lesson</span>
                            </button>
                            <button
                                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentPageIndex === 0}
                                className="px-4 py-2 bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPageIndex === pages.length - 1 && showCompletion}
                                className="px-4 py-2 bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                            >
                                {currentPageIndex === pages.length - 1 ? 'Complete' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default LessonViewer; 