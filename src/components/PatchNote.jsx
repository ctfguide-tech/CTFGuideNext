import { MarkdownViewer } from '@/components/MarkdownViewer';
import React from 'react';

export function PatchNote({props}) {
  return (
    <>
      <div className="mb-3 mt-3 rounded-lg bg-neutral-800 px-4">
        <div className="mb-4 pt-2">
          <h1 className="text-xl font-semibold text-blue-600 ">
            Version 2.0.0
            <span className="pl-3 text-right text-lg text-white">8/2/2024</span>
          </h1>
          <h2 className="text-lg text-white ">Title</h2>
        </div>
        <div className="px-5 py-5 ">
          <div contentEditable={false}>
            <MarkdownViewer className="text-white font-medium" content="Welcome to CTFGuide 2.0!"/>
          </div>
        </div>
      </div>
    </>
  );
}
