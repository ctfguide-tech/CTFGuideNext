import React from 'react';
import UpNextCard from './cards/UpNextCard';
const UpNext = ({ className }) => {
  return (
    <div className={className}>
      <h1 className='text-3xl font-bold'>Up next for you</h1>
      <div className='grid grid-cols-2 gap-2 mt-2'>
        <UpNextCard title="Where am I?" description="Linux Basics" type="lab" image="../../whereami.jpeg" />
        <UpNextCard title="Mastery Task" description="Linux Basics" type="task"/>
      </div>
    </div>
  );
};

export default UpNext;
