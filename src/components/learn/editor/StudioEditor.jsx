import React, { useState, useEffect, useMemo, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dynamic from 'next/dynamic';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { motion, AnimatePresence } from 'framer-motion';
import request from '../../../utils/request';
import { Context } from '../../../context';
// Dynamic import of MonacoEditor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false
});

const LANGUAGE_CONFIG = {
    python: {
        icon: 'fab fa-python',
        name: 'Python',
        monacoLang: 'python'
    },
    javascript: {
        icon: 'fab fa-js',
        name: 'JavaScript',
        monacoLang: 'javascript'
    },
    cpp: {
        icon: 'fas fa-code',
        name: 'C++',
        monacoLang: 'cpp'
    },
    bash: {
        icon: 'fas fa-terminal',
        name: 'Bash',
        monacoLang: 'shell'
    },
    shell: {
        icon: 'fas fa-terminal',
        name: 'Shell Script',
        monacoLang: 'shell'
    }
};

const TUTORIAL_STEPS = [
    {
        id: 1,
        target: 'editor-container',
        content: 'Welcome to the Studio Editor! Right-click anywhere to start adding components.',
        position: 'center'
    },
    {
        id: 2,
        target: 'markdown-component',
        content: 'Add Markdown components to write formatted text, documentation, or instructions.',
        position: 'bottom'
    },
    {
        id: 3,
        target: 'multiple-choice',
        content: 'Create multiple choice questions to test knowledge. Don\'t forget to set the correct answer!',
        position: 'bottom'
    },
    {
        id: 4,
        target: 'code-component',
        content: 'Add code components to write examples or create coding challenges.',
        position: 'bottom'
    },
    {
        id: 5,
        target: 'drag-handle',
        content: 'Drag components to reorder them. Build your content in any order you like!',
        position: 'right'
    }
];

const getIconForType = (type) => {
    switch (type) {
        case 'markdown':
            return 'markdown';
        case 'multiple-choice':
            return 'list-ul';
        case 'code':
            return 'code';
        default:
            return 'plus';
    }
};

const ErrorModal = ({ isOpen, onClose, error }) => (
    <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity`}
        onClick={onClose}
    >
        <div 
            className="bg-neutral-800 rounded-xl border border-red-500/50 p-6 w-full max-w-md m-4"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex items-center space-x-2 text-red-400 mb-4">
                <i className="fas fa-exclamation-circle text-xl"></i>
                <h3 className="text-lg font-medium">Error Saving Lesson</h3>
            </div>
            <p className="text-neutral-300 mb-6">
                {error || 'An unexpected error occurred while saving. Please try again.'}
            </p>
            <div className="flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

// Add this Toast component near the top of the file, after other component imports
const Toast = ({ message, type = 'success', onClose }) => {
    // Add useEffect for auto-dismiss
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        // Cleanup timer
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-2
                ${type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                 type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}
        >
            <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 hover:text-white transition-colors">
                <i className="fas fa-times"></i>
            </button>
        </motion.div>
    );
};

const StudioEditor = ({ initialLesson = null, onLessonCreated }) => {
    const { username } = useContext(Context);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [pages, setPages] = useState(() => {
        if (initialLesson && initialLesson.content) {
            try {
                // Parse the content directly from initialLesson.content
                const parsedPages = JSON.parse(initialLesson.content);
                console.log('Parsed pages from content:', parsedPages);
                return parsedPages;
            } catch (error) {
                console.error('Error parsing lesson content:', error);
                return [{ id: Date.now(), title: 'Page 1', components: [] }];
            }
        }
        return [{ id: Date.now(), title: 'Page 1', components: [] }];
    });

    // Remove the window.alert that was showing the content
    useEffect(() => {
        console.log('StudioEditor initialLesson:', initialLesson);
        console.log('StudioEditor initial pages:', pages);
    }, [initialLesson]);

    // Log whenever pages change
    useEffect(() => {
        console.log('Current pages state:', pages);
    }, [pages]);

    // Initialize pages state
    const [currentPageId, setCurrentPageId] = useState(() => pages[0]?.id || null);
    
    // Find current page and its components
    const currentPage = pages.find(p => p.id === currentPageId) || pages[0];
    const currentComponents = currentPage?.components || [];

    const [showPageModal, setShowPageModal] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [showLoadJsonModal, setShowLoadJsonModal] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState('');
    const [showImportProjectModal, setShowImportProjectModal] = useState(false);
    const [projectJsonInput, setProjectJsonInput] = useState('');
    const [importError, setImportError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [saveError, setSaveError] = useState(null);
    const [showPublishModal, setShowPublishModal] = useState(false);

    // Log the initial data
    useEffect(() => {
       // window.alert(JSON.stringify(initialLesson.content));
        console.log('StudioEditor initialLesson:', initialLesson);
        console.log('StudioEditor initial pages:', pages);
    }, [initialLesson]);

    const handleStartFresh = () => {
        setIsLoading(false);
    };

    const handleInitialImport = () => {
        try {
            const parsedJson = JSON.parse(projectJsonInput);
            if (!parsedJson.pages || !Array.isArray(parsedJson.pages)) {
                throw new Error('Invalid project format: missing pages array');
            }
            
            setPages(parsedJson.pages);
            setCurrentPageId(parsedJson.pages[0]?.id || null);
            setIsLoading(false);
            setProjectJsonInput('');
            setImportError('');
        } catch (error) {
            setImportError(error.message);
        }
    };

    useEffect(() => {
        // Check if user has seen tutorial before
        const tutorialSeen = localStorage.getItem('studioEditorTutorialSeen');
        if (!tutorialSeen) {
            setShowTutorial(true);
            localStorage.setItem('studioEditorTutorialSeen', 'true');
        }
    }, []);

    const nextTutorialStep = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setShowTutorial(false);
            setHasSeenTutorial(true);
        }
    };

    const skipTutorial = () => {
        setShowTutorial(false);
        setHasSeenTutorial(true);
    };

    // Handle right-click to show component menu
    const handleContextMenu = (e) => {
        e.preventDefault();
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible(true);
    };

    // Handle click outside to close menu
    useEffect(() => {
        const handleClickOutside = () => setMenuVisible(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle adding new components
    const handleAddComponent = (type) => {
        const newComponent = {
            id: Date.now(),
            type,
            content: '',
            config: getDefaultConfig(type)
        };
        
        setPages(prevPages => prevPages.map(page => {
            if (page.id === currentPageId) {
                return {
                    ...page,
                    components: [...page.components, newComponent]
                };
            }
            return page;
        }));
        setMenuVisible(false);
    };

    // Get default configuration based on component type
    const getDefaultConfig = (type) => {
        switch (type) {
            case 'markdown':
                return { preview: false };
            case 'multiple-choice':
                return { options: [], correctAnswer: null };
            case 'code':
                return { language: 'python', testCases: [] };
            default:
                return {};
        }
    };

    // Handle updating component content
    const handleUpdateComponent = (id, updates) => {
        setPages(prevPages => prevPages.map(page => {
            if (page.id === currentPageId) {
                return {
                    ...page,
                    components: page.components.map(comp => 
                        comp.id === id ? { ...comp, ...updates } : comp
                    )
                };
            }
            return page;
        }));
    };

    const insertText = (id, text) => {
        const component = currentComponents.find(comp => comp.id === id);
        if (!component) return;

        const textarea = document.querySelector(`textarea[data-id="${id}"]`);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = component.content || '';
        const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
        
        handleUpdateComponent(id, { content: newContent });
    };

    // Handle deleting components
    const handleDeleteComponent = (id) => {
        setPages(prevPages => prevPages.map(page => {
            return {
                ...page,
                components: page.components.filter(comp => comp.id !== id)
            };
        }));
    };

    // Handle drag and drop reordering
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(currentComponents);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setPages(prevPages => prevPages.map(page => {
            if (page.id === currentPageId) {
                return {
                    ...page,
                    components: items
                };
            }
            return page;
        }));
    };

    // Render different component types
    const renderComponent = (component) => {
        switch (component.type) {
            case 'markdown':
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 overflow-hidden bg-neutral-800/40 rounded-xl border border-neutral-700/30 shadow-2xl backdrop-blur-md"
                    >
                        <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/50 px-4 py-2 flex items-center justify-between backdrop-blur-sm">
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-pen text-blue-300"></i>
                                <h3 className="text-base font-medium text-white">Markdown Editor</h3>
                            </div>
                            <div className="toolbar flex space-x-1">
                                {['bold', 'italic', 'heading', 'link', 'code'].map((tool) => (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        key={tool}
                                        onClick={() => insertText(component.id, getToolMarkdown(tool))}
                                        className="hover:bg-white/10 p-1.5 rounded transition-all group"
                                    >
                                        <i className={`fas fa-${tool} group-hover:text-blue-300 transition-colors`}></i>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-6" onClick={(e) => e.stopPropagation()}>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-xl transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                                <textarea
                                    value={component.content || ''}
                                    onChange={(e) => handleUpdateComponent(component.id, { content: e.target.value })}
                                    data-id={component.id}
                                    className="w-full h-48 bg-neutral-900/50 text-white p-4 rounded-xl border border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono text-sm"
                                    placeholder="Write your markdown here..."
                                />
                            </div>
                            <div className="markdown-preview bg-neutral-900/50 p-4 rounded-xl border border-neutral-700/30 h-48 overflow-auto prose prose-invert prose-sm max-w-none">
                                <MarkdownViewer content={component.content || ''} />
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-neutral-800/50 border-t border-neutral-700/30 flex justify-between items-center">
                            <div className="text-xs text-neutral-400">Drag to reorder</div>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteComponent(component.id)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                            >
                                <i className="fas fa-trash-alt"></i>
                                <span>Delete</span>
                            </motion.button>
                        </div>
                    </motion.div>
                );
            case 'multiple-choice':
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 overflow-hidden bg-neutral-800/40 rounded-xl border border-neutral-700/30 shadow-2xl backdrop-blur-md"
                    >
                        <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/50 px-4 py-2 flex items-center justify-between backdrop-blur-sm">
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-list-ul text-blue-300"></i>
                                <h3 className="text-base font-medium text-white">Multiple Choice</h3>
                            </div>
                        </div>
                        <div className="p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-xl transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                                <input
                                    type="text"
                                    value={component.content || ''}
                                    onChange={(e) => handleUpdateComponent(component.id, { content: e.target.value })}
                                    className="w-full bg-neutral-900/50 text-white p-4 rounded-xl border border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                    placeholder="Enter your question..."
                                />
                            </div>
                            
                            <div className="space-y-3">
                                {component.config.options.map((option, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="flex items-center space-x-3 group"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateComponent(component.id, {
                                                    config: { ...component.config, correctAnswer: index }
                                                });
                                            }}
                                            className="flex items-center space-x-2 bg-neutral-900/50 px-4 py-2 rounded-xl border border-neutral-700/30 cursor-pointer group/toggle hover:bg-neutral-800/50 transition-all"
                                        >
                                            <div className={`
                                                w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out
                                                ${component.config.correctAnswer === index ? 'bg-green-500/30' : 'bg-neutral-700/30'}
                                            `}>
                                                <motion.div 
                                                    initial={false}
                                                    animate={{
                                                        x: component.config.correctAnswer === index ? "16px" : "0px",
                                                        backgroundColor: component.config.correctAnswer === index ? "rgb(34, 197, 94)" : "rgb(82, 82, 82)"
                                                    }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="w-3.5 h-3.5 rounded-full shadow-md"
                                                />
                                            </div>
                                            <span className={`
                                                text-sm font-medium transition-colors duration-200
                                                ${component.config.correctAnswer === index ? 'text-green-400' : 'text-neutral-400'}
                                                group-hover/toggle:${component.config.correctAnswer === index ? 'text-green-300' : 'text-neutral-300'}
                                            `}>
                                                Correct Answer
                                            </span>
                                            {component.config.correctAnswer === index && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-green-400 ml-1"
                                                >
                                                    <i className="fas fa-check text-xs"></i>
                                                </motion.div>
                                            )}
                                        </div>
                                        <div className="flex-1 relative group" onClick={(e) => e.stopPropagation()}>
                                            <div className="absolute inset-0 bg-blue-500/5 rounded-xl transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...component.config.options];
                                                    newOptions[index] = e.target.value;
                                                    handleUpdateComponent(component.id, {
                                                        config: { ...component.config, options: newOptions }
                                                    });
                                                }}
                                                className={`
                                                    w-full bg-neutral-900/50 text-white p-3 rounded-xl border transition-all text-sm
                                                    ${component.config.correctAnswer === index 
                                                        ? 'border-green-500/30 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20' 
                                                        : 'border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'}
                                                `}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newOptions = component.config.options.filter((_, i) => i !== index);
                                                let newCorrectAnswer = component.config.correctAnswer;
                                                if (index === component.config.correctAnswer) {
                                                    newCorrectAnswer = null;
                                                } else if (index < component.config.correctAnswer) {
                                                    newCorrectAnswer--;
                                                }
                                                handleUpdateComponent(component.id, {
                                                    config: { 
                                                        ...component.config, 
                                                        options: newOptions,
                                                        correctAnswer: newCorrectAnswer
                                                    }
                                                });
                                            }}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all"
                                        >
                                            <i className="fas fa-times"></i>
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleUpdateComponent(component.id, {
                                        config: {
                                            ...component.config,
                                            options: [...component.config.options, '']
                                        }
                                    })}
                                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>Add Option</span>
                                </motion.button>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-neutral-800/50 border-t border-neutral-700/30 flex justify-between items-center">
                            <div className="text-xs text-neutral-400">Drag to reorder</div>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteComponent(component.id)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                            >
                                <i className="fas fa-trash-alt"></i>
                                <span>Delete</span>
                            </motion.button>
                        </div>
                        {component.config.correctAnswer === null && component.config.options.length > 0 && (
                            <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/20">
                                <p className="text-yellow-500 text-sm flex items-center">
                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                    Please select a correct answer
                                </p>
                            </div>
                        )}
                    </motion.div>
                );
            case 'code':
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 overflow-hidden bg-neutral-800/40 rounded-xl border border-neutral-700/30 shadow-2xl backdrop-blur-md"
                    >
                        <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/50 px-4 py-2 flex items-center justify-between backdrop-blur-sm">
                            <div className="flex items-center space-x-2">
                                <i className={`${LANGUAGE_CONFIG[component.config.language]?.icon} text-blue-300`}></i>
                                <h3 className="text-base font-medium text-white">Code Editor</h3>
                            </div>
                            <select
                                value={component.config.language}
                                onChange={(e) => handleUpdateComponent(component.id, {
                                    config: { ...component.config, language: e.target.value }
                                })}
                                className="bg-white/10 text-white px-3 py-1 rounded-lg border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm backdrop-blur-md"
                            >
                                {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                                    <option key={key} value={key} className="bg-neutral-800">
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="p-4">
                            <div className="rounded-xl overflow-hidden border border-neutral-700/30">
                                <MonacoEditor
                                    height="200px"
                                    language={LANGUAGE_CONFIG[component.config.language]?.monacoLang || 'plaintext'}
                                    value={component.content}
                                    onChange={(value) => handleUpdateComponent(component.id, { content: value })}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        padding: { top: 16, bottom: 16 },
                                        scrollBeyondLastLine: false,
                                        renderLineHighlight: 'all',
                                        fontFamily: 'JetBrains Mono, monospace',
                                        roundedSelection: true,
                                        cursorStyle: 'line-thin',
                                        cursorBlinking: 'smooth',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-neutral-800/50 border-t border-neutral-700/30 flex justify-between items-center">
                            <div className="text-xs text-neutral-400">Drag to reorder</div>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteComponent(component.id)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                            >
                                <i className="fas fa-trash-alt"></i>
                                <span>Delete</span>
                            </motion.button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    // Add this helper function for markdown toolbar
    const getToolMarkdown = (tool) => {
        switch (tool) {
            case 'bold':
                return '**bold text**';
            case 'italic':
                return '*italic text*';
            case 'heading':
                return '# Heading';
            case 'link':
                return '[link text](url)';
            case 'code':
                return '```\ncode block\n```';
            default:
                return '';
        }
    };

    const JsonViewerModal = () => (
        <AnimatePresence>
            {showJsonModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={() => setShowJsonModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-neutral-800/90 rounded-xl border border-neutral-700/50 shadow-2xl backdrop-blur-sm w-full max-w-3xl m-4"
                    >
                        <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/50 px-4 py-3 flex items-center justify-between rounded-t-xl backdrop-blur-sm">
                            <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                                <i className="fas fa-code text-blue-300"></i>
                                <span>Component JSON Data</span>
                            </h3>
                            <button
                                onClick={() => setShowJsonModal(false)}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="bg-neutral-900/50 rounded-xl border border-neutral-700/30 p-4 overflow-auto max-h-[60vh]">
                                <pre className="text-sm font-mono text-white">
                                    {JSON.stringify(currentComponents, null, 2)}
                                </pre>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-neutral-400">
                                    This data will be stored in the backend
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(currentComponents, null, 2));
                                    }}
                                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                                >
                                    <i className="fas fa-copy"></i>
                                    <span>Copy JSON</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const handleLoadJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            if (!Array.isArray(parsedJson)) {
                throw new Error('JSON must be an array of components');
            }
            
            // Validate each component has required fields
            parsedJson.forEach(comp => {
                if (!comp.type || !comp.id) {
                    throw new Error('Each component must have type and id fields');
                }
            });

            setPages(prevPages => prevPages.map(page => {
                if (page.id === currentPageId) {
                    return {
                        ...page,
                        components: parsedJson
                    };
                }
                return page;
            }));
            setJsonInput('');
            setJsonError('');
            setShowLoadJsonModal(false);
        } catch (error) {
            setJsonError(error.message);
        }
    };

    const LoadJsonModal = () => (
        <AnimatePresence>
            {showLoadJsonModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={() => setShowLoadJsonModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-neutral-800/90 rounded-xl border border-neutral-700/50 shadow-2xl backdrop-blur-sm w-full max-w-3xl m-4"
                    >
                        <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/50 px-4 py-3 flex items-center justify-between rounded-t-xl backdrop-blur-sm">
                            <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                                <i className="fas fa-file-import text-blue-300"></i>
                                <span>Load Components from JSON</span>
                            </h3>
                            <button
                                onClick={() => setShowLoadJsonModal(false)}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-xl transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    className="w-full h-64 bg-neutral-900/50 text-white p-4 rounded-xl border border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                                    placeholder="Paste your JSON here..."
                                />
                            </div>
                            {jsonError && (
                                <div className="mt-2 text-red-400 text-sm flex items-center space-x-2">
                                    <i className="fas fa-exclamation-circle"></i>
                                    <span>{jsonError}</span>
                                </div>
                            )}
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowLoadJsonModal(false)}
                                    className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLoadJson}
                                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                                >
                                    <i className="fas fa-file-import"></i>
                                    <span>Load Components</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Add page management functions
    const handleAddPage = () => {
        if (!newPageTitle.trim()) return;
        
        const newPage = {
            id: Date.now(),
            title: newPageTitle,
            components: []
        };
        
        setPages(prevPages => [...prevPages, newPage]);
        setCurrentPageId(newPage.id);
        setNewPageTitle('');  // Clear the input
        setShowPageModal(false);  // Close modal
    };

    const handleDeletePage = (pageId) => {
        if (pages.length <= 1) return; // Don't delete last page
        setPages(pages.filter(p => p.id !== pageId));
        if (currentPageId === pageId) {
            setCurrentPageId(pages[0].id);
        }
    };

    const handleRenamePage = (pageId, newTitle) => {
        setPages(pages.map(page => 
            page.id === pageId ? { ...page, title: newTitle } : page
        ));
    };

    // Add handler for project import
    const handleImportProject = () => {
        try {
            const parsedJson = JSON.parse(projectJsonInput);
            if (!parsedJson.pages || !Array.isArray(parsedJson.pages)) {
                throw new Error('Invalid project format: missing pages array');
            }
            
            // Validate project structure
            parsedJson.pages.forEach(page => {
                if (!page.id || !page.title || !Array.isArray(page.components)) {
                    throw new Error('Invalid page format');
                }
            });

            setPages(parsedJson.pages);
            setCurrentPageId(parsedJson.pages[0]?.id || null);
            setProjectJsonInput('');
            setImportError('');
            setShowImportProjectModal(false);
        } catch (error) {
            setImportError(error.message);
        }
    };

    // Add handler for project export
    const handleExportProject = () => {
        const projectData = {
            pages,
            version: "1.0",
            exportedAt: new Date().toISOString()
        };
        
        const jsonString = JSON.stringify(projectData, null, 2);
        
        // Create and trigger download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ctfguide-project-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Add Import Project Modal component
    const ImportProjectModal = () => {
        if (!showImportProjectModal) return null;

        return (
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={() => setShowImportProjectModal(false)}
            >
                <div
                    className="bg-neutral-800/90 rounded-xl border border-neutral-700/50 shadow-2xl backdrop-blur-sm w-full max-w-3xl m-4"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/50 px-4 py-2 flex items-center justify-between rounded-t-xl backdrop-blur-sm">
                        <h3 className="text-base font-medium text-white flex items-center space-x-2">
                            <i className="fas fa-file-import text-blue-300"></i>
                            <span>Import Project</span>
                        </h3>
                        <button
                            onClick={() => setShowImportProjectModal(false)}
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="relative">
                            <textarea
                                value={projectJsonInput}
                                onChange={e => setProjectJsonInput(e.target.value)}
                                className="w-full h-64 bg-neutral-900/50 text-white p-4 rounded-xl border border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                                placeholder="Paste your project JSON here..."
                            />
                        </div>
                        {importError && (
                            <div className="mt-2 text-red-400 text-sm flex items-center space-x-2">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{importError}</span>
                            </div>
                        )}
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setShowImportProjectModal(false)}
                                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImportProject}
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                            >
                                <i className="fas fa-file-import"></i>
                                <span>Import Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Add the context menu component
    const ContextMenu = () => (
        <AnimatePresence>
            {menuVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed bg-neutral-800/90 rounded-xl shadow-2xl border border-neutral-700/50 backdrop-blur-sm p-1 z-50"
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                >
                    {['markdown', 'multiple-choice', 'code'].map((type) => (
                        <motion.div
                            key={type}
                            whileHover={{ x: 4 }}
                            className="px-4 py-2 hover:bg-blue-500/20 rounded-lg cursor-pointer transition-all flex items-center space-x-2 group"
                            onClick={() => handleAddComponent(type)}
                        >
                            <i className={`fas fa-${getIconForType(type)} group-hover:text-blue-400 transition-colors`}></i>
                            <span className="capitalize">{type.replace('-', ' ')}</span>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );

    const Sidebar = () => (
        <div className="fixed left-4 top-32 bottom-4 w-64 z-40 flex flex-col space-y-4">
            {/* Pages Section */}
            <div className="bg-neutral-800/90 rounded-xl border border-neutral-700/50 shadow-lg backdrop-blur-sm p-3 flex-1">
                <div className="flex items-center justify-between mb-4">
                  
                    <div className="flex items-center space-x-2">
                        
                        <i className="fas fa-book text-blue-400"></i>
                        <span className="text-sm font-medium text-white">Pages</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPageModal(true)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-lg transition-all text-sm"
                    >
                        <i className="fas fa-plus"></i>
                    </motion.button>
                </div>
                <Droppable droppableId="pages-list">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className="space-y-1 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700/50 scrollbar-track-transparent"
                        >
                            {pages.map((page, index) => (
                                <Draggable 
                                    key={page.id} 
                                    draggableId={`page-${page.id}`} 
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <motion.div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`
                                                group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                                                ${currentPageId === page.id ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-white'}
                                                ${snapshot.isDragging ? 'ring-2 ring-blue-500/50 shadow-lg !my-0' : 'my-0.5'}
                                            `}
                                            onClick={() => setCurrentPageId(page.id)}
                                        >
                                            <div 
                                                {...provided.dragHandleProps}
                                                className="flex items-center space-x-2 flex-1"
                                            >
                                                <i className="fas fa-grip-vertical text-neutral-500 group-hover:text-neutral-400 transition-colors"></i>
                                                <span className="text-sm truncate max-w-[120px]">{page.title}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPageToRename(page);
                                                        setNewTitle(page.title);
                                                        setShowRenameModal(true);
                                                    }}
                                                    className="p-1 hover:text-blue-400 transition-colors"
                                                >
                                                    <i className="fas fa-pen text-xs"></i>
                                                </button>
                                                {pages.length > 1 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm('Delete this page?')) handleDeletePage(page.id);
                                                        }}
                                                        className="p-1 hover:text-red-400 transition-colors"
                                                    >
                                                        <i className="fas fa-trash text-xs"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>

            {/* Renamed from JSON Actions to Lesson Actions */}
            <div className="bg-neutral-800/90 rounded-xl border border-neutral-700/50 shadow-lg backdrop-blur-sm p-3">
                <div className="flex items-center space-x-2 mb-3">
                    <i className="fas fa-sliders-h text-purple-400"></i>
                    <span className="text-sm font-medium text-white">Lesson Actions</span>
                </div>
                <div className="space-y-2">
                    {/* Save button in green */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveLesson}
                        disabled={isSaving}
                        className={`w-full px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center space-x-2
                            ${isSaving 
                                ? 'bg-neutral-700/50 text-neutral-400 cursor-not-allowed' 
                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'}`}
                    >
                        {isSaving ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin"></i>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i>
                                <span>Save Lesson</span>
                            </>
                        )}
                    </motion.button>

                    {/* Import button in orange */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowImportProjectModal(true)}
                        className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center space-x-2"
                    >
                        <i className="fas fa-file-import"></i>
                        <span>Import Project</span>
                    </motion.button>

                    {/* Rest of the buttons remain unchanged */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportProject}
                        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center space-x-2"
                    >
                        <i className="fas fa-file-export"></i>
                        <span>Export Project</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPublishModal(true)}
                        className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center space-x-2"
                    >
                        <i className="fas fa-globe"></i>
                        <span>Publish Lesson</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );

    // Add new page modal
    const NewPageModal = () => {
        if (!showPageModal) return null;  // Don't render if not showing

        return (
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={() => setShowPageModal(false)}
            >
                <div
                    className="bg-neutral-800/90 rounded-xl border border-neutral-700/50 shadow-2xl backdrop-blur-sm w-full max-w-md m-4 p-4"
                    onClick={e => e.stopPropagation()}
                >
                    <h3 className="text-lg font-medium text-white mb-4">Add New Page</h3>
                    <input
                        type="text"
                        value={newPageTitle}
                        onChange={e => setNewPageTitle(e.target.value)}
                        placeholder="Enter page title"
                        className="w-full bg-neutral-900/50 text-white p-3 rounded-xl border border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all mb-4"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                setNewPageTitle('');
                                setShowPageModal(false);
                            }}
                            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddPage}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                        >
                            Add Page
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Add state for rename modal
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [pageToRename, setPageToRename] = useState(null);
    const [newTitle, setNewTitle] = useState('');

    // Add RenamePageModal component
    const RenamePageModal = () => {
        if (!showRenameModal || !pageToRename) return null;

        return (
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={() => {
                    setShowRenameModal(false);
                    setPageToRename(null);
                    setNewTitle('');
                }}
            >
                <div
                    className="bg-neutral-800/90 rounded-xl border border-neutral-700/50 shadow-2xl backdrop-blur-sm w-full max-w-md m-4 p-4"
                    onClick={e => e.stopPropagation()}
                >
                    <h3 className="text-lg font-medium text-white mb-4">Rename Page</h3>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="Enter new page title"
                        className="w-full bg-neutral-900/50 text-white p-3 rounded-xl border border-neutral-700/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all mb-4"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                setShowRenameModal(false);
                                setPageToRename(null);
                                setNewTitle('');
                            }}
                            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (newTitle.trim()) {
                                    handleRenamePage(pageToRename.id, newTitle.trim());
                                    setShowRenameModal(false);
                                    setPageToRename(null);
                                    setNewTitle('');
                                }
                            }}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                        >
                            Rename Page
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        // Handle any additional initialization needed for imported projects
        if (initialLesson) {
            // You could add additional validation or data processing here
            console.log('Project imported successfully');
        }
    }, [initialLesson]);

    // Add this new function to handle page reordering
    const onDragEndPages = (result) => {
        if (!result.destination) return;

        const items = Array.from(pages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setPages(items);
    };

    const handleSaveLesson = async () => {
        try {
            setIsSaving(true);
            setError(null);

            // Format the lesson data
            const lessonData = {
                title: initialLesson?.title || pages[0]?.title || 'Untitled Lesson',
                description: initialLesson?.description || '',
                content: JSON.stringify(pages.map(page => ({
                    id: page.id,
                    title: page.title,
                    components: page.components || []
                }))),
                pages: pages.map((page, index) => ({
                    title: page.title,
                    content: JSON.stringify(page.components || []),
                    order: index
                }))
            };

            console.log('Sending lesson data:', lessonData);

            let response;
            if (initialLesson?.id) {
                response = await request(
                    `${process.env.NEXT_PUBLIC_API_URL}/lessons/${initialLesson.id}`, 
                    'PUT', 
                    lessonData
                );
            } else {
                response = await request(
                    `${process.env.NEXT_PUBLIC_API_URL}/lessons`, 
                    'POST', 
                    lessonData
                );
            }

            console.log('Save response:', response);

            if (response.error) {
                throw new Error(response.error);
            }

            // Replace alert with toast
            setToast({ message: 'Lesson saved successfully!', type: 'success' });
            
            if (!initialLesson?.id && response.id) {
                onLessonCreated?.(response);
            }

        } catch (error) {
            console.error('Failed to save lesson:', error);
            setError(error.message || 'Failed to save lesson. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishRequest = async () => {
        try {
            const lessonId = initialLesson?.id;
            
            if (!lessonId) {
                setToast({
                    message: 'Please save the lesson first before publishing',
                    type: 'error'
                });
                return;
            }

            let lessonLink = `https://ctfguide.com/learn/${lessonId}`;
            const response = await request(
                `${process.env.NEXT_PUBLIC_API_URL}/lesson-publish-request`,
                'POST',
                { 
                    lessonId,
                    title: initialLesson?.title || pages[0]?.title || 'Untitled Lesson',
                    authorName: username || 'Anonymous',
                    lessonLink
                }
            );
            
            setShowPublishModal(false);
            setToast({
                message: 'Publish request sent successfully!',
                type: 'success'
            });
        } catch (error) {
            console.error('Error sending publish request:', error);
            setToast({
                message: 'Failed to send publish request',
                type: 'error'
            });
        }
    };

    // Add this new component near other modal components
    const PublishModal = () => (
        <AnimatePresence>
            {showPublishModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    onClick={() => setShowPublishModal(false)}
                >
                    {/* Move globe to bottom right and increase z-index */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="fixed bottom-10 right-10 w-32 h-32 pointer-events-none z-[60]"
                    >
                        <div className="relative w-full h-full">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-2 border-purple-500/20"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-2 rounded-full border-2 border-purple-400/20"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <i className="fas fa-globe text-6xl text-purple-400/50"></i>
                            </motion.div>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [0, 1, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                    className="absolute w-2 h-2 rounded-full bg-purple-400/30"
                                    style={{
                                        left: `${50 + 35 * Math.cos(i * Math.PI / 3)}%`,
                                        top: `${50 + 35 * Math.sin(i * Math.PI / 3)}%`,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="absolute bottom-0 inset-x-0 bg-neutral-800/90 rounded-t-xl border-t border-neutral-700/50 shadow-2xl backdrop-blur-sm p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-xl font-medium text-white mb-4 flex items-center space-x-2">
                                <i className="fas fa-globe text-purple-400"></i>
                                <span>Publish Lesson</span>
                            </h3>
                            
                            <div className="bg-neutral-900/50 rounded-xl p-4 mb-6 border border-neutral-700/30">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-neutral-400">Title:</span>
                                    <span className="text-white font-medium">
                                        {initialLesson?.title || pages[0]?.title || 'Untitled Lesson'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Author:</span>
                                    <span className="text-white font-medium">
                                        {username || 'Anonymous'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="prose prose-invert prose-sm max-w-none mb-6">
                                <p>Before publishing your lesson, please ensure:</p>
                                <ul className="list-disc list-inside ml-4" >
                                    <li>All content is appropriate and follows our community guidelines</li>
                                    <li>The lesson is complete and properly structured</li>
                                    <li>All code examples are working as intended</li>
                                    <li>Multiple choice questions have correct answers selected</li>
                                </ul>
                                <p className="text-neutral-400 mt-2">
                                    Your lesson will be reviewed by our team before being published to the platform.
                                    We'll notify you once it's approved.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowPublishModal(false)}
                                    className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePublishRequest}
                                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 px-6 py-2 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
                                >
                                    <i className="fas fa-check"></i>
                                    <span>I Understand, Submit for Review</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
   
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-900 to-neutral-950 text-white p-6 relative">
            <p>                   
        </p>
            <DragDropContext onDragEnd={onDragEndPages}>
                <Sidebar />
            </DragDropContext>
            <NewPageModal />
            <JsonViewerModal />
            <LoadJsonModal />
            <ImportProjectModal />
            <ContextMenu />
            <RenamePageModal />
            <PublishModal />

            {/* Main content area - remove bottom padding */}
            <div 
                className="ml-72 min-h-screen"
                onContextMenu={handleContextMenu}
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="components">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef}
                                className="min-h-[100px] pt-1"
                            >
                                {currentComponents.map((component, index) => (
                                    <Draggable
                                        key={component.id}
                                        draggableId={component.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="transition-all hover:translate-x-1"
                                            >
                                                <div className="flex items-start">
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="mt-6 mr-2 p-2 rounded-lg bg-neutral-800/40 border border-neutral-700/30 cursor-move hover:bg-neutral-700/40 transition-colors"
                                                    >
                                                        <i className="fas fa-grip-vertical text-neutral-400"></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        {renderComponent(component)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <ErrorModal 
                isOpen={!!error}
                onClose={() => setError(null)}
                error={error}
            />
            <AnimatePresence>
                {toast && (
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudioEditor;

