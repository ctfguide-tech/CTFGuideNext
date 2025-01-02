import React from 'react';
import { StandardNav } from '../../components/StandardNav';
import ModuleLayout from '../../components/learn/modules/ModuleLayout';
import UpNext from '../../components/learn/modules/UpNext';
import { Footer } from '../../components/Footer';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import request from '@/utils/request';

const ModulesPage = () => {
    const [modules, setModules] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nextLesson, setNextLesson] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await request('/lessons', 'GET');
                setModules(response.categories);
                
                // Find the next incomplete lesson for UpNext
                Object.values(response.categories).forEach(category => {
                    category.forEach(module => {
                        const incompletePage = module.pages.find(page => !page.completed);
                        if (incompletePage && !nextLesson) {
                            setNextLesson({
                                moduleTitle: module.title,
                                pageTitle: incompletePage.title,
                                pageId: incompletePage.id,
                                type: incompletePage.content?.type || 'LAB'
                            });
                        }
                    });
                });
            } catch (error) {
                toast.error('Failed to load modules');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-900">
            <StandardNav />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <UpNext nextLesson={nextLesson} />
                        <ModuleLayout modules={modules} />
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ModulesPage;