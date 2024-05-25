import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from "@/utils/request";
import { MarkdownViewer } from '@/components/MarkdownViewer';

export default function Create() {
  const [isOpen, setIsOpen] = useState(false);
  const [contentPreview, setContentPreview] = useState('');
  const [title, setTitle] = useState('');
  useEffect(() => {
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null)
        .then((data) => {
          // Handle data
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleLoad = (event) => {
  //  let cid = router.query.id; // Challenge ID
    

  }

  const initWriteup = (event) => {
    // Fetch the data from the form
    try {
        request(`${process.env.NEXT_PUBLIC_API_URL}/writeups`, "POST", {
            title: "Untitled Writeup",
            content: "",
            })
            .then((data) => {
               // hide loader
            })
            .catch((err) => {
                console.log(err);
            });

    } catch (error) {
        console.error(error);
    }

  };


  const insertText = (text) => {
    const textarea = document.getElementById('content');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const newValue = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos, textarea.value.length);
    setContentPreview(newValue);
    textarea.focus();
    textarea.selectionEnd = startPos + text.length;
  };

  return (
    <>
      <Head>
        <title>Create - CTFGuide</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <main className='flex items-center justify-center min-h-screen text-center'>
        <div className='center text-center mx-auto'>
            <h1><i className="fas fa-spinner text-white fa-spin text-4xl mb-5"></i></h1>
          <h1 className='text-white text-xl'>Setting up CTFGuide Editor</h1>
        </div>
      </main>
      <main className='hidden'>


      <div className='text-white text-xl px-6 py-4 w-full bg-neutral-800 flex'>
        <div>
<h1>CTFGuide Editor <span className='bg-blue-600 px-2 rounded-lg text-sm'>BETA</span></h1>
</div>

<div className='ml-auto text-sm '>
<button className='bg-red-600 px-4 py-1 mr-3 rounded-lg'><i className="fas fa-trash fa-fw"></i> Delete</button>

    <button className='bg-indigo-600 px-4 py-1 mr-3 rounded-lg'><i className="fas fa-save fa-fw"></i> Save</button>
    <button className='bg-green-600 px-4 py-1 mr-3 rounded-lg'><i className="fas fa-rocket fa-fw"></i> Publish</button>
</div>
      </div>

        <div className='px-6 mx-auto'>
          <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
  className='px-0 mt-2 bg-transparent border-none w-full text-white text-4xl placeholder-neutral-700 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none'
  placeholder='Enter your title here'
  autoFocus
/>
          <div className='grid grid-cols-2 gap-x-10 border-t border-neutral-800 '>
            <div className='mt-3'>
              <div className="toolbar py-1 ">
              <button onClick={() => insertText('**bold**')} className="toolbar-button text-white pr-2 mr-1">
                  <i className="fas fa-bold"></i>
                </button>
                <button onClick={() => insertText('*italic*')} className="toolbar-button text-white px-2 mr-1" >
                  <i className="fas fa-italic"></i>
                </button>
                <button onClick={() => insertText('# Heading')} className="toolbar-button text-white px-2 mr-1">
                  <i className="fas fa-heading"></i>
                </button>
                <button onClick={() => insertText('[link](url)')} className="toolbar-button text-white px-2 mr-1">
                  <i className="fas fa-link"></i>
                </button>
                <button onClick={() => insertText('```Code```')} className="toolbar-button text-white px-2 mr-1">
                  <i className="fas fa-code"></i>
                </button>
              </div>
              <textarea
                value={contentPreview}
                id="content"
                placeholder="You can use Markdown here!"
                style={{ height: 'calc(100vh - 200px)' }}
                className="px-0 h-full w-full rounded-lg border-none placeholder-neutral-700 bg-neutral-900 px-5 py-4 text-white focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
                onChange={(event) => {
                  setContentPreview(event.target.value);
                }}
              />
            </div>
            <div className='border-l border-neutral-800'>
              <div contentEditable={false} className='text-white py-4 px-4'>
                <MarkdownViewer content={contentPreview} />
              </div>
            </div>
          </div>
        </div>
      </main>



      <div className="hidden center fixed bottom-6 right-6 rounded-md bg-neutral-800/50 text-sm text-white p-2 opacity-40">
          Automatically saved at 12:22AM.
        </div>
      
      




      <div className='hidden flex w-full h-full grow basis-0'></div>
      <Footer />
    </>
  );
}