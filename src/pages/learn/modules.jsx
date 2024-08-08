import React from 'react';
import { StandardNav } from '../../components/StandardNav';
import ProgressSideBar from '../../components/learn/shared/ProgressSideBar';
import ModuleLayout from '../../components/learn/modules/ModuleLayout';
import UpNext from '../../components/learn/modules/UpNext';

const ModulesPage = () => {
    return (
        <>
            <StandardNav />


            <div className='grid grid-cols-2 text-white'>


                {/* Side bar */}
                <div>
                    <ProgressSideBar />
                </div>


                {/* Content */}
                <div>

                    <UpNext />
                    <ModuleLayout />
                    
                </div>


            </div>


        </>
    );
};

export default ModulesPage;
