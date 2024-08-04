import { MarkdownViewer } from '@/components/MarkdownViewer';
import React from 'react';

export function PatchNote({description, date, title, version}) {
  return (
    <>
      <div className="mb-3 mt-3 rounded-lg bg-neutral-800 px-4">
        <div className="mb-4 pt-2">
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
        <div className="px-5 py-5 ">
          <div contentEditable={false}>
            <MarkdownViewer className="text-white font-medium" content={description}/>
          </div>
        </div>
      </div>
    </>
  );
}
