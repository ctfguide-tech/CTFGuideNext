import { useEffect, useState, useContext } from 'react';
import LessonViewer from '@/components/learn/viewer/LessonViewer';
import { StandardNav } from '@/components/StandardNav';
import { useRouter } from 'next/router';
import request from '@/utils/request';
import { Context } from '@/context';

export default function LessonPage() {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModControls, setShowModControls] = useState(true);
    const { role } = useContext(Context);
    // print account type
    const router = useRouter();
    const { lessonId, page } = router.query;

    const handleApproveLesson = async () => {
        try {
            await request(
                `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/approve`,
                'POST'
            );
            // Refresh the lesson data
            router.reload();
        } catch (err) {
            setError('Failed to approve lesson');
        }
    };

    const handlePrivateLesson = async () => {
        try {
            await request(
                `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/private`,
                'POST'
            );
            router.reload();
        } catch (err) {
            setError('Failed to make lesson private');
        }
    };

    useEffect(() => {
        const fetchLesson = async () => {
            if (!lessonId) return;
            
            try {
                const data = await request(
                    `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}`,
                    'GET'
                );
                
                if (!data) {
                    throw new Error('Failed to fetch lesson');
                }
                
                const parsedContent = JSON.parse(data.content);
                const initialPageValue = page ? Math.max(0, parseInt(page) - 1) : 0;
                console.log("Setting initial page to:", initialPageValue);

                setLesson({
                    ...data,
                    content: parsedContent,
                    initialPage: initialPageValue
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId, page]);

    const ModeratorPanel = () => (
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border-b border-neutral-700 p-4  shadow-lg">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-4">
                    {/* Top row with controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                                </svg>
                                <span className="text-blue-400 font-semibold">Moderator Controls</span>
                            </div>
                            <button
                                onClick={() => setShowModControls(false)}
                                className="text-neutral-400 hover:text-white text-sm flex items-center space-x-1 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Hide</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleApproveLesson}
                                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Approve Lesson</span>
                            </button>
                            <button
                                onClick={handlePrivateLesson}
                                className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>Make Private</span>
                            </button>
                        </div>
                    </div>

                    {/* Lesson Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                            <div className="flex items-center space-x-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                </svg>
                                <span className="text-neutral-200 font-medium">Lesson Details</span>
                            </div>
                            <div className="space-y-1 text-neutral-400">
                                <p>Author: <span className="text-neutral-200">{lesson?.author || 'Unknown'}</span></p>
                                <p>Created: <span className="text-neutral-200">{new Date(lesson?.createdAt).toLocaleDateString()}</span></p>
                                <p>Status: <span className="text-neutral-200">{lesson?.published.toString() || 'Unknown'}</span></p>
                            </div>
                        </div>

                        <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                            <div className="flex items-center space-x-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                                <span className="text-neutral-200 font-medium">Statistics</span>
                            </div>
                            <div className="space-y-1 text-neutral-400">
                                <p>Pages: <span className="text-neutral-200">{lesson?.content?.length || 0}</span></p>
                                <p>Views: <span className="text-neutral-200">{lesson?.views || 0}</span></p>
                                <p>Completions: <span className="text-neutral-200">{lesson?.completions || 0}</span></p>
                            </div>
                        </div>

                        <div className="hidden bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                            <div className="flex items-center space-x-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span className="text-neutral-200 font-medium">Quick Actions</span>
                            </div>
                            <div className="space-y-2">
                                <button className="w-full text-left text-neutral-400 hover:text-blue-400 transition-colors">
                                    View Analytics
                                </button>
                                <button className="w-full text-left text-neutral-400 hover:text-blue-400 transition-colors">
                                    Edit Lesson
                                </button>
                                <button className="w-full text-left text-neutral-400 hover:text-blue-400 transition-colors">
                                    View Reports
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div>
                <StandardNav />
                <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-4 border-neutral-700 border-t-blue-500 animate-spin"></div>
                        <div className="mt-4 text-sm text-neutral-400">Loading lesson...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <StandardNav />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {role === 'ADMIN' && showModControls && <ModeratorPanel />}
            {role === 'ADMIN' && !showModControls && (
                <button
                    onClick={() => setShowModControls(true)}
                    className="fixed bottom-4 right-4 bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors"
                >
                    Show Mod Controls
                </button>
            )}
            <LessonViewer lessonData={lesson} />
        </div>
    );
} 