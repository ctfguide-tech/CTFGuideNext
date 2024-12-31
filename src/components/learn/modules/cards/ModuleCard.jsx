import React from 'react';

const ModuleCard = ({ title, description, image, status, type, completed, active }) => {
  return (
    <>
    <div className={`transition-all duration-300 ease-in-out module-card py-8 ${active ? 'bg-gradient-to-b from-neutral-800 to-green-900/40' : 'cursor-pointer transition-colors duration-500 bg-neutral-800 hover:bg-gradient-to-b hover:from-neutral-800 hover:to-yellow-900/40'}`}>
      <div className='px-10 '>
        {
          image && <img src={image} alt={title} className='w-full h-full object-cover' />
        }
        <h3 className="text-lg font-semibold">{title}</h3>
        <p>{description}</p>


      </div>
      <div className='flex px-10'>
        <div className=' justify-between'>
          <div>
            <p>{completed}</p>
          </div>
        </div>
        <div className='ml-auto'>
          <p>{status}</p>
        </div>
      </div>
    </div>
   
    </>
  );
};

export default ModuleCard;