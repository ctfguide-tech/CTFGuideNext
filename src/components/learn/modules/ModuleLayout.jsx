import React from 'react';
import ModuleCard from './cards/ModuleCard';

const ModuleLayout = ({ className }) => {
  return (
    <div className={`module-layout ${className}`}>
      <h1 className='text-3xl font-bold'>Modules</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <ModuleCard title='Linux Basics' description='This is the first module' status='In Progress' type='module' completed='10%' active={true} />
            <ModuleCard title='Linux Commands' description='This is the second module' status='In Progress' type='module' completed='10%' active={false} />
            <ModuleCard title='Linux Permissions' description='This is the third module' status='In Progress' type='module' completed='10%' active={false} />
            <ModuleCard title='Linux Processes' description='This is the fourth module' status='Not Started' type='module' completed='10%' active={false} />
        </div>
    </div>
  );
};

export default ModuleLayout;