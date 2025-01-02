import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LessonNavbar({ lessonId }) {
    const [isImporting, setIsImporting] = useState(false);
    const router = useRouter();

    const handleImport = async () => {
        setIsImporting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/import/${lessonId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Import failed');
            
            alert('Lesson imported successfully!');
        } catch (error) {
            console.error('Error importing lesson:', error);
            alert('Failed to import lesson');
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Add your other navbar items here */}
                    </div>
                    <div className="flex items-center">
                        <button 
                            onClick={handleImport}
                            disabled={isImporting}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {isImporting ? 'Importing...' : 'Import Lesson'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 