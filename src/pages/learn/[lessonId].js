import { useEffect, useState } from 'react';
import LessonViewer from '@/components/learn/viewer/LessonViewer';
import { StandardNav } from '@/components/StandardNav';
import { useRouter } from 'next/router';
import request from '@/utils/request';

export default function LessonPage() {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { lessonId, page } = router.query;

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
            <LessonViewer lessonData={lesson} />
        </div>
    );
} 