import React, { useState, useEffect } from 'react';
import {StandardNav} from '../../../components/StandardNav';
import StudioEditor from '../../../components/learn/editor/StudioEditor';

const LearnEditor = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [projectJsonInput, setProjectJsonInput] = useState('');
    const [importError, setImportError] = useState('');
    const [importedProject, setImportedProject] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

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

    return (
        <>
        <StandardNav/>
        {isLoading ? (
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-900 to-neutral-950">
                <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                    <div className="w-full max-w-2xl">
                        <div className="bg-neutral-800/40 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
                            <div className="bg-neutral-800 border-t-4 border-blue-600 p-4">
                                <div className="flex items-center space-x-3 mr-2">
                                    <div>
                                        <h1 className="text-white  text-lg">CTFGuide Studio</h1>
                                        <p className="text-neutral-400 text-sm">Create interactive learning experiences</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-1 bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-blue-700/10">
                                <div 
                                    className={`p-8 transition-all rounded-xl ${
                                        isDragging 
                                            ? 'bg-blue-500/10 border-2 border-dashed border-blue-500/50' 
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
                                <div className="flex items-center space-x-3">
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
                    <div>
                        <h1 className='text-sm py-2'> Learn Studio <span className='ml-2 bg-blue-800 text-white text-sm px-3 rounded-full'>v.0.2</span></h1>
                    </div>
                    <div className='ml-auto text-sm flex space-x-1'>
                        <button className='text-red-600 px-2'><i className="fas fa-trash fa-fw"></i> Delete</button>
                        <button className='text-green-600 px-2'><i className="fas fa-save fa-fw"></i> Save</button>
                    </div>
                </div>
                <StudioEditor initialProject={importedProject} />
            </div>
        )}
        </>
    );
};

export default LearnEditor;
