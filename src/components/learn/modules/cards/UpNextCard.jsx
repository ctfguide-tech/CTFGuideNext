import React from 'react';

const UpNextCard = ({ title, description, type, image }) => {
    if (type === 'lab') {
        return (
            
            <div className="bg-neutral-800 w-full h-full cursor-pointer transition-all duration-300 ease-in-out" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className='w-full h-full bg-neutral-900 bg-opacity-60 hover:bg-opacity-40 transition-all duration-300 ease-in-out'>
                <div className='py-10 px-12 '>
                    <h3 className="text-4xl font-semibold mt-10">{title}</h3>
                    <p className='text-white text-3xl'>{description}</p>
                </div>
              
              
              <div className='flex justify-end'>
                <p className='bg-neutral-900 bg-opacity-80 text-white text-2xl font-semibold pl-12 pr-10 py-2 rounded-tl-full'>{type.toUpperCase()}</p>
              </div>
              </div>
            </div>
          );
    }

    if (type === 'task') {
        return (
            <div className="bg-gradient-to-b from-yellow-600 to-yellow-700/90">
             
             <div className='py-10 px-12 mt-10'>
                    <h3 className="text-4xl font-semibold">{title}</h3>
                    <p className='text-white text-3xl'>{description}</p>
                </div>
              
              
                <div className='flex justify-end'>
                <p className='bg-neutral-900 bg-opacity-80 text-white text-2xl font-semibold pl-12 pr-10 py-2 rounded-tl-full'>{type.toUpperCase()}</p>
              </div>
            </div>
          );
    }

    return (
       <h1 className='text-red-500 text-left text-xl'>Component failure. You did not specify a valid type for the UpNextCard component.</h1>
    )
};

export default UpNextCard;
