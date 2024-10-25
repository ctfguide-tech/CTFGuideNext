import React, { useState, useEffect } from 'react';
import {StandardNav} from '../../../components/StandardNav';
import StudioEditor from '../../../components/learn/editor/StudioEditor';
const LearnEditor = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

  return (
    <>
    <StandardNav/>
    {isLoading ? (
    <div className="container mx-auto h-full px-4 flex flex-col items-center justify-center  text-white text-2xl">

            <div className='bg-neutral-800 border-t-4 border-blue-700 mb-20 w-full max-w-md col-span-6'>
     
           <div className='flex justify-between px-4 py-2 '>
            <div>
           <h1 className='mt-4 flex items-center text-xl'>  <a href="/" className="flex items-center ml-1">
                          <img
                            className="z-10 h-10 w-10"
                            src="/darkLogo.png"
                            alt="CTFGuide"
                          />
                          <h1 className="text-xl text-white font-semibold mr-1">CTFGuide </h1>
                        </a>  Studio</h1>
                        </div>
                        <div className='ml-auto mt-4 px-4 py-1 text-white text-xl'>
                            <i className="fas fa-spinner fa-spin"></i>
                        </div>
           </div>
            <div className='flex justify-between px-6 py-2'>
                <textarea className='bg-neutral-900  border-none text-xs text-white w-full p-2' disabled 
                
                value={`Creating a draft module...
error: expected OK instead got null
Allocating terminals...
error: expected OK instead got null
Preparing editor...
error: missing terminal id in json
error: attempting to load editor will result in error. contact support@ctfguide.com
`

}
                >
                
                </textarea>

            </div>
           <p className='text-white text-sm px-6 bg-neutral-700 py-2 mt-4'>alpha v0.2</p>
        

            </div>
    </div>
    ) : (
        <div className='h-full'>
          <div className='text-white text-xl px-6 w-full bg-neutral-800 flex justify-between items-center'>
            <div>
              <h1 className='text-sm py-2'> Learn Studio <span className='ml-2 bg-blue-800 text-white text-sm px-3 rounded-full'>v.0.2</span></h1>
            </div>
            <div className='ml-auto text-sm flex space-x-1'>
              <button className='text-red-600 px-2 '><i className="fas fa-trash fa-fw"></i> Delete</button>
              <button className='text-green-600 px-2 '><i className="fas fa-save fa-fw"></i> Save</button>
            </div>
          </div>
          <StudioEditor/>
        </div>
    )}
    </>
  );
};

export default LearnEditor;
