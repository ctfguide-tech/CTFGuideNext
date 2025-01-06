import React from 'react';
import { StandardNav } from '../../components/StandardNav';
import ModuleLayout from '../../components/learn/modules/ModuleLayout';
import UpNext from '../../components/learn/modules/UpNext';
import { Footer } from '../../components/Footer';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import request from '@/utils/request';
import { motion } from 'framer-motion';
import { Map, Trophy } from 'lucide-react';
const ModulesPage = () => {
    const [modules, setModules] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nextLesson, setNextLesson] = useState(null);
    const [showBetaModal, setShowBetaModal] = useState(false);
    const [stats, setStats] = useState({
        completedModules: 0,
        totalModules: 0,
        rank: 'Apprentice',
        rankLevel: 1,
        nextRank: 'Novice',
        modulesToNextRank: 0
    });

    useEffect(() => {
        const betaModalDismissed = localStorage.getItem('betaModalDismissed');
        if (!betaModalDismissed) {
            setShowBetaModal(true);
        }
    }, []);

    const handleCloseBetaModal = () => {
        setShowBetaModal(false);
        localStorage.setItem('betaModalDismissed', 'true');
    };

    useEffect(() => {
        const fetchModules = async () => {
            console.log('Fetching modules...');

            try {
                console.log('Fetching modules...');
                const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/lessons/published`, 'GET');
                if (response && response.lessons) {
                    setModules(response.lessons);
                    
                    // Calculate stats
                    const completedModules = response.lessons.filter(lesson => 
                        lesson.progress && 
                        lesson.progress.length > 0 && 
                        lesson.progress[0].percentage === 100
                    ).length;
                    
                    // Calculate rank based on completed modules
                    let rank, rankLevel, nextRank, modulesToNextRank;

                    if (completedModules >= 10) {
                        rank = 'Master';
                        rankLevel = 4;
                        nextRank = 'Master';
                        modulesToNextRank = 0;
                    } else if (completedModules >= 7) {
                        rank = 'Expert';
                        rankLevel = 3;
                        nextRank = 'Master';
                        modulesToNextRank = 10 - completedModules;
                    } else if (completedModules >= 4) {
                        rank = 'Novice';
                        rankLevel = 2;
                        nextRank = 'Expert';
                        modulesToNextRank = 7 - completedModules;
                    } else {
                        rank = 'Apprentice';
                        rankLevel = 1;
                        nextRank = 'Novice';
                        modulesToNextRank = 4 - completedModules;
                    }

                    setStats({
                        completedModules,
                        totalModules: response.stats.totalModules,
                        rank,
                        rankLevel,
                        nextRank,
                        modulesToNextRank
                    });

                    console.log(response.lessons);
                    console.log(response.stats);
                    // Find next incomplete lesson
                    const nextIncomplete = response.lessons.find(lesson => 
                        !lesson.progress || 
                        lesson.progress.length === 0 || 
                        lesson.progress[0].percentage < 100
                    );
                    
                    if (nextIncomplete) {
                        setNextLesson({
                            moduleTitle: nextIncomplete.title,
                            pageTitle: nextIncomplete.pages?.[0]?.title,
                            pageId: nextIncomplete.pages?.[0]?.id,
                            type: nextIncomplete.pages?.[0]?.content?.type || 'LAB'
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching modules:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-900">
            <StandardNav />

            {showBetaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="p-6 rounded-lg shadow-lg bg-neutral-900 text-white">
                        <h2 className="text-xl font-bold mb-4">Beta Feature</h2>
                        <p>This feature is heavily in development and is currently in beta.</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={handleCloseBetaModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                       <div className="text-white text-center">
                       <h1 className="text-4xl font-bold">Loading...</h1>
                       <p className="text-gray-400">This may take a few seconds.</p>
                       </div>
                    </div>
                ) : (
                    <>
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
                                                    <p className="text-3xl font-bold text-white">{stats.completedModules}</p>
                                                    <span className="text-gray-400 text-sm">/{stats.totalModules}</span>
                                                    <span className="text-purple-400 text-sm ml-2">
                                                        ({stats.totalModules > 0 ? Math.round((stats.completedModules / stats.totalModules) * 100) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative z-10 mt-4 bg-[#1c1c1c]/50 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" 
                                                style={{ width: `${stats.totalModules > 0 ? (stats.completedModules / stats.totalModules) * 100 : 0}%` }}>
                                            </div>
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
                                                <p className="text-3xl font-bold text-white">{stats.rank}</p>
                                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full">
                                                    Level {stats.rankLevel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Next rank: <span className="text-indigo-400">{stats.nextRank}</span> 
                                        {stats.modulesToNextRank > 0 && ` (${stats.modulesToNextRank} modules to go)`}
                                    </p>

                                    <div className="opacity-40 absolute right-10 bottom-0 top-4 transform translate-x-1/4 translate-y-1/4">
                                <Trophy size={160} strokeWidth={1} className="text-indigo-500" />
                                </div>
                                </motion.div>

                              
                            </div>
                        </div>
                        <ModuleLayout modules={modules} />
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ModulesPage;