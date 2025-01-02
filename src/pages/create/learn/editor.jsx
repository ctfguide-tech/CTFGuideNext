import React, { useState, useEffect, useRef } from 'react';
import {StandardNav} from '../../../components/StandardNav';
import StudioEditor from '../../../components/learn/editor/StudioEditor';
import request from '../../../utils/request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const NewLessonModal = ({ 
    showModal, 
    onClose, 
    title, 
    setTitle, 
    description, 
    setDescription, 
    category, 
    setCategory, 
    onCreateLesson 
}) => (
    <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${
            showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity`}
        onClick={onClose}
    >
        <div 
            className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 w-full max-w-md m-4"
            onClick={e => e.stopPropagation()}
        >
            <h3 className="text-lg font-medium text-white mb-4">Create New Lesson</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter lesson title"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 h-24"
                        placeholder="Enter lesson description"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="GENERAL">General</option>
                        <option value="PROGRAMMING">Programming</option>
                        <option value="CYBERSECURITY">Cybersecurity</option>
                        <option value="NETWORKING">Networking</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onCreateLesson}
                        disabled={!title.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
                    >
                        Create Lesson
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const LearnEditor = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userLessons, setUserLessons] = useState([]);
    const [isLoadingLessons, setIsLoadingLessons] = useState(true);
    const [projectJsonInput, setProjectJsonInput] = useState('');
    const [importError, setImportError] = useState('');
    const [importedProject, setImportedProject] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const fileInputRef = useRef(null);
    const [showNewLessonModal, setShowNewLessonModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const [modules, setModules] = useState([]);
    const [moduleState, setModuleState] = useState('unverified');

    const fetchModules = async (state) => {
        setModuleState(state);
        try {
            const response = await request(
                `${process.env.NEXT_PUBLIC_API_URL}/account/modules?state=${state}`,
                'GET',
                null
            );
            if (Array.isArray(response)) {
                setModules(response);
            } else {
                setModules([]);
            }
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            setModules([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonsResponse, modulesResponse] = await Promise.all([
                    request(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, 'GET'),
                    request(`${process.env.NEXT_PUBLIC_API_URL}/account/modules?state=unverified`, 'GET')
                ]);
                
                setUserLessons(lessonsResponse);
                if (Array.isArray(modulesResponse)) {
                    setModules(modulesResponse);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoadingLessons(false);
            }
        };

        fetchData();
    }, []);

    const handleLoadLesson = async (lesson) => {
        try {
            setIsLoading(true);
            console.log('Loading lesson:', lesson.id);
            const response = await request(
                `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lesson.id}`, 
                'GET'
            );
            
            router.push(`/create/learn/editor?id=${lesson.id}`, undefined, { shallow: true });
            
            console.log('Received lesson data:', response.content);
            setImportedProject(response);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to load lesson:', error);
            console.error('Error details:', error.response || error);
            toast.error('Failed to load lesson. Please try again.');
            setIsLoading(false);
        }
    };

    const handleImportProject = (jsonContent) => {
        try {
            const parsedJson = JSON.parse(jsonContent);
            if (!parsedJson.pages || !Array.isArray(parsedJson.pages)) {
                throw new Error('Invalid project format: missing pages array');
            }
            
            setImportedProject(parsedJson);
            setIsLoading(false);
            setProjectJsonInput('');
            setImportError('');
        } catch (error) {
            setImportError(error.message);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    handleImportProject(event.target.result);
                } catch (error) {
                    setImportError('Failed to read JSON file');
                }
            };
            reader.readAsText(file);
        } else {
            setImportError('Please drop a valid JSON file');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonContent = event.target.result;
                    const parsedJson = JSON.parse(jsonContent);
                    window.alert(parsedJson);
                    setImportedProject(parsedJson);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Failed to parse JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleInitialImport = () => {
        try {
            const parsedJson = JSON.parse(projectJsonInput);
            if (!parsedJson.pages || !Array.isArray(parsedJson.pages)) {
                throw new Error('Invalid project format: missing pages array');
            }
            
            setImportedProject(parsedJson);
            setIsLoading(false);
            setShowImportModal(false);
            setProjectJsonInput('');
            setImportError('');
        } catch (error) {
            setImportError(error.message);
        }
    };

    const handleStartLesson = async () => {
        try {
            const uniqueTitle = `${title} - ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`;
            
            const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, 'POST', {
                title: uniqueTitle,
                description,
                category,
                pages: [{ title: 'Page 1', content: '[]', order: 0 }]
            });

            setImportedProject(response);
            setShowNewLessonModal(false);
            setIsLoading(false);
            
            // Success toast
            toast.success('Lesson created successfully!');
        } catch (error) {
            console.error('Failed to create lesson:', error);
            // Error toast with specific message
            toast.error(error.message || 'Failed to create lesson. Please try again.');
        }
    };

    const ImportModal = () => (
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${
                showImportModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } transition-opacity`}
            onClick={() => setShowImportModal(false)}
        >
            <div 
                className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 w-full max-w-md m-4"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-medium text-white mb-4">Import Lesson</h3>
                <div className="space-y-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 border-2 border-dashed border-neutral-700 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-neutral-400 hover:text-blue-400"
                    >
                        <i className="fas fa-file-upload text-2xl mb-2"></i>
                        <p>Click to upload JSON file</p>
                        <p className="text-sm opacity-75">or drag and drop</p>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <div className="text-center">
                        <span className="text-neutral-500">or</span>
                    </div>
                    <textarea
                        value={projectJsonInput}
                        onChange={(e) => setProjectJsonInput(e.target.value)}
                        placeholder="Paste JSON content here..."
                        className="w-full h-32 bg-neutral-900 text-white rounded-xl border border-neutral-700 p-3 text-sm"
                    />
                    {importError && (
                        <p className="text-red-400 text-sm">{importError}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setShowImportModal(false)}
                            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInitialImport}
                            disabled={!projectJsonInput}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                        >
                            Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
        <StandardNav/>
        <ImportModal />
        <NewLessonModal 
            showModal={showNewLessonModal}
            onClose={() => setShowNewLessonModal(false)}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            onCreateLesson={handleStartLesson}
        />
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
        {isLoading ? (
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-900 to-neutral-950">
                <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                    <div className="w-full max-w-2xl">
                        <div className="bg-neutral-800/40 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
                            <div className="bg-neutral-800 p-4">
                                <div className="flex items-center space-x-3 mr-2">
                                    <div>
                                        <h1 className="text-white text-lg">CTFGuide Studio</h1>
                                        <p className="text-neutral-400 text-sm">Create interactive learning experiences</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-b border-neutral-700/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-white text-lg">Your Lessons</h2>
                                    <div className="flex space-x-2 hidden">
                                        <button
                                            onClick={() => setShowImportModal(true)}
                                            className="px-4 py-2 bg-neutral-700/20 hover:bg-neutral-700/30 text-neutral-400 rounded-lg transition-all text-sm"
                                        >
                                            <i className="fas fa-file-import mr-2"></i>
                                            Import
                                        </button>
                                        <button
                                            onClick={() => setShowNewLessonModal(true)}
                                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Create New
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
                                    {isLoadingLessons ? (
                                        <div className="text-center py-8">
                                            <i className="fas fa-circle-notch fa-spin text-neutral-400 text-2xl"></i>
                                        </div>
                                    ) : userLessons.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-neutral-400">No lessons found. Create your first one!</p>
                                        </div>
                                    ) : (
                                        userLessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                onClick={() => handleLoadLesson(lesson)}
                                                className="group p-4 bg-neutral-800/40 hover:bg-neutral-800/60 rounded-xl border border-neutral-700/50 cursor-pointer transition-all"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-white font-medium">{lesson.title}</h3>
                                                        <p className="text-neutral-400 text-sm">
                                                            {lesson.pages.length} page{lesson.pages.length !== 1 ? 's' : ''} • {lesson.status.toLowerCase()}
                                                        </p>
                                                    </div>
                                                    <i className="fas fa-chevron-right text-neutral-600 group-hover:text-neutral-400 transition-colors"></i>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                                  {/* legacy */}
                            <div className=" hidden p-1 bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-blue-700/10">
                                <div 
                                    className={`p-8 transition-all rounded-xl ${
                                        isDragging 
                                            ? 'bg-blue-500/10 border-4 border-dashed border-blue-500/50' 
                                            : 'border-2 border-dashed border-neutral-700/30 hover:border-neutral-600/50'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="text-center space-y-3">
                                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br ${
                                            isDragging ? 'from-blue-500/20 to-blue-600/20' : 'from-neutral-700/20 to-neutral-800/20'
                                        }`}>
                                            <i className={`fas fa-file-import text-2xl ${isDragging ? 'text-blue-400' : 'text-neutral-400'}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                Drop your project file here
                                            </p>
                                            <p className="text-sm text-neutral-400 mt-1">
                                                or paste JSON below
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="relative">
                                            <textarea
                                                className="w-full h-32 bg-neutral-900/50 text-white text-sm p-4 rounded-xl border border-neutral-800/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-neutral-600"
                                                value={projectJsonInput}
                                                onChange={(e) => setProjectJsonInput(e.target.value)}
                                                placeholder="Paste your project JSON here..."
                                            />
                                            <div className="absolute bottom-3 right-3 text-xs text-neutral-600">
                                                {projectJsonInput ? `${projectJsonInput.length} characters` : 'JSON'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {importError && (
                                <div className="px-6 py-3 bg-red-500/10 border-t border-red-500/20 flex items-center space-x-2">
                                    <i className="fas fa-exclamation-circle text-red-400"></i>
                                    <span className="text-red-400 text-sm">{importError}</span>
                                </div>
                            )}

                            <div className="p-4 bg-neutral-900/50 border-t border-neutral-800/50 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
                                        alpha v0.2
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 hidden">
                                    <button
                                        onClick={() => setIsLoading(false)}
                                        className="text-neutral-400 hover:text-white text-sm transition-colors"
                                    >
                                        Start Fresh
                                    </button>
                                    <button
                                        onClick={() => handleImportProject(projectJsonInput)}
                                        disabled={!projectJsonInput}
                                        className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center space-x-2 ${
                                            projectJsonInput 
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' 
                                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <i className="fas fa-file-import"></i>
                                        <span>Import Project</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className='h-full'>
                <div className='text-white text-xl px-6 w-full bg-neutral-800 flex justify-between items-center'>
                    <div className="flex items-center space-x-4">
                        <h1 className='text-sm py-2'>
                            Learn Studio 
                            <span className='ml-2 bg-blue-800 text-white text-sm px-3 rounded-full'>v.0.2</span>
                        </h1>
                        {importedProject && (
                            <>
                                <span className="text-neutral-500">/</span>
                                <span className="text-sm text-neutral-300">{importedProject.title}</span>
                            </>
                        )}
                    </div>
                
                </div>
                <StudioEditor 
                    initialLesson={importedProject}
                    onLessonCreated={(lesson) => {
                        // Handle newly created lesson
                        setUserLessons(prev => [lesson, ...prev]);
                    }}
                />
            </div>
        )}
        </>
    );
};

export default LearnEditor;
