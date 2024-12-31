import React from 'react';
import { StandardNav } from '../../components/StandardNav';
import ProgressSideBar from '../../components/learn/shared/ProgressSideBar';
import ModuleLayout from '../../components/learn/modules/ModuleLayout';
import UpNext from '../../components/learn/modules/UpNext';
import { Footer } from '../../components/Footer';
import { useState } from 'react';
const ModulesPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <>
            <StandardNav />

            {/* main layout for learn */}
            <div className='grid grid-cols-6 text-white max-h-screen h-screen max-w-screen '>


                {/* Side bar */}
                {sidebarOpen && (
                <div className='col-span-1 bg-neutral-800 max-h-screen max-w-screen px-4 pt-4'>
                    <div className='flex justify-end'>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="relative"><i className="fas fa-chevron-left text-xl text-white mr-1"></i></button>
                    </div>
                    {sidebarOpen && <ProgressSideBar progress={10} active="Linux Basics" />}
                    
                </div>
                )}


                {/* Content */}
                <div className={`${sidebarOpen ? 'col-span-5 px-4' : 'sm:col-span-6 col-span-1 px-10'} bg-neutral-900 max-h-screen max-w-screen  pt-4`}>
                    {/* Up Next */}

                {!sidebarOpen && (
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="absolute  bg-neutral-800 opacity-50 hover:opacity-100 px-2 rounded-r-full py-2 left-0 z-10"
                    >
                        <i className="fas fa-chevron-right text-xl text-white mr-1"></i>
                    </button>
                )}
                    <UpNext />


                    {/* Module Layout */}
                    <ModuleLayout className='mt-4'/>
                    
                </div>


            </div>
            <div className="flex h-[12vh] w-full grow basis-0"></div>

            <Footer />


        </>
    );
};

export default ModulesPage;