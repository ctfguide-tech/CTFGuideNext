import React from 'react';
import { StandardNav } from '../../components/StandardNav';
import ProgressSideBar from '../../components/learn/shared/ProgressSideBar';
import ModuleLayout from '../../components/learn/modules/ModuleLayout';
import UpNext from '../../components/learn/modules/UpNext';
import { Footer } from '../../components/Footer';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Trophy, Map } from 'lucide-react';

const ModulesPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    return (
        <div className="min-h-screen bg-[#1c1c1c]">
            <StandardNav />

            <div className='flex min-h-[calc(100vh-64px)]'>
                <AnimatePresence mode="wait">
               
                </AnimatePresence>

                <motion.div 
                    className="flex-1 relative"
                    animate={{ 
                        marginLeft: sidebarOpen ? '0px' : '0px',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {!sidebarOpen && (
                        <motion.button 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setSidebarOpen(true)}
                            className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#2b2b2b] hover:bg-[#3d3d3d] 
                                     px-3 py-6 rounded-r-lg shadow-lg transition-all duration-200"
                        >
                            <i className="fas fa-chevron-right text-gray-400 hover:text-white"></i>
                        </motion.button>
                    )}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="relative">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="h-[180px] bg-gradient-to-br from-neutral-700/10 to-neutral-800 p-6 border-l-4 shadow-md border-purple-500/10 relative overflow-hidden"
                                >
                                    <motion.div layout className="relative z-10">
                                        <div className="flex items-center space-x-4 mt-2">
                                            <div className="bg-purple-500/10 p-3 rounded-lg">
                                                <i className="fas fa-book-open text-2xl text-purple-400"></i>
                                            </div>
                                            <div>
                                                <h3 className="text-gray-400 text-sm font-medium mb-1">Modules Completed</h3>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-3xl font-bold text-white">3</p>
                                                    <span className="text-gray-400 text-sm">/12</span>
                                                    <span className="text-purple-400 text-sm ml-2">(25%)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative z-10 mt-4 bg-[#1c1c1c]/50 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full w-1/4"></div>
                                        </div>
                                    </motion.div>

                                    <div className="opacity-40 absolute right-10 bottom-0 top-4 transform translate-x-1/4 translate-y-1/4">
                                        <Map size={160} strokeWidth={1} className="text-purple-500" />
                                    </div>
                                </motion.div>
                            </div>

                            <div className="relative">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="h-[180px] bg-gradient-to-br from-neutral-700/10 to-neutral-800 p-6 border-l-4 shadow-md border-indigo-500/10 relative overflow-hidden"
                                >
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="bg-indigo-500/10 p-3 rounded-lg">
                                            <i className="fas fa-crown text-2xl text-indigo-400"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-gray-400 text-sm font-medium mb-1">Current Rank</h3>
                                            <div className="flex items-center">
                                                <p className="text-3xl font-bold text-white">Apprentice</p>
                                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full">
                                                    Level 1
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Next rank: <span className="text-indigo-400">Novice</span> (2 modules to go)
                                    </p>

                                    <div className="opacity-40 absolute right-10 bottom-0 top-4 transform translate-x-1/4 translate-y-1/4">
                                <Trophy size={160} strokeWidth={1} className="text-indigo-500" />
                                </div>
                                </motion.div>

                              
                            </div>
                        </div>

                        <div className="mb-8">
                            <UpNext />
                            <ModuleLayout />
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default ModulesPage;