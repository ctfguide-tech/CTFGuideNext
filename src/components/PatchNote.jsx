import { MarkdownViewer } from '@/components/MarkdownViewer';
import React from 'react';
import { useState } from 'react';

export function PatchNote({description, date, title, version}) {
  const [dropDown, setDropDown] = useState(false);
  const [readMoreBtn, setReadMoreBtn] = useState(false);
  

  return (
    <>
      <div
       className="cursor-pointer mb-5 mt-3 rounded-lg bg-gradient-to-r from-blue-900 to-gray-950 " >
        <div className="mb-4 pt-2 pb-2 px-4"  onClick={() => setDropDown(!(dropDown) )
      }>
          <div className='flex justify-center items-center'>
            <div>
            <h1 className="text-xl font-semibold text-blue-600 ">
            {version}
            <h2 className="text-lg text-white ">{title}</h2>
          </h1>
            </div>
            <div className='ml-auto'>
            <h2 className="pl-3 text-right text-lg text-white">{date}</h2>
            </div>
          </div>
        </div>

      {!dropDown ? <div className={`px-8 py-5 rounded-b-lg bg-neutral-800 transition-all duration-200 ease-in-out opacity-100`}>
            <div contentEditable={false} style={{ overflow: 'auto' }} >
              <MarkdownViewer  className={`text-white font-medium transition-all duration-200 ease-in-out opacity-100`} content={readMoreBtn ? description.substring(0, 125): description}/>
              {description.length>190 && (
              <button onClick={() => setReadMoreBtn(!readMoreBtn)} className='text-slate-600 ml-2' > {readMoreBtn ? '...Read    More': 'Read Less'}</button>
              )
              }
            </div>
          </div>: <div className={`px-7 py-0.5 rounded-b-lg  transition-all duration-300 ease-in-out opacity-0`}/>
          }
        
      

      </div>
    </>
  );
}
