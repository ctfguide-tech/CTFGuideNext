import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from "@/utils/request";
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useRouter } from 'next/router';
import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';

export default function Create() {
  const [isOpen, setIsOpen] = useState(false);
  const [contentPreview, setContentPreview] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editorFailure, setEditorFailure] = useState(false);
  const [publishView, setPublishView] = useState(false);
  const [isPublishSaved, setPublishSaved] = useState(false);
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null)
        .then((data) => {
          handleLoad();
          if (router.query.publish == "done") {
            setPublishSaved(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  }, [router.query.cid]);

  const handleLoad = (event) => {
    let cid = router.query.cid; // Challenge ID

    if (!cid) {
      console.log("CID is undefined");
      setIsLoading(false);
      return;
    }

    request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/fetch/${cid}`, "GET", null) // Fetch the writeup
      .then((data) => {
        console.log(data);
        setTitle(data.title);
        setContentPreview(data.content);
        setIsPublished(data.draft);

        
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }




  const magicSnippet = () => {
    // creaate a random id
    const id = Math.random().toString(36).substring(7);

    insertText(`[Click to run: ${id}](https://ctfguide.com/magic/)`);
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
 
  const handleSave = () => {
     // sometimes auto save triggers before cid is avaliable for usage.
    // without this if -- it'll try to save data for undefined. lol.
    if (router.query.cid) {
    console.log(`Saving ${router.query.cid}...`)

    setIsSaving(true);
    const cid = router.query.cid;
    request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${cid}`, "PUT", {
      title: title,
      content: contentPreview,
    })
      .then((data) => {
        
        setTimeout(() => {
            setIsSaving(false);
        }, 2000);
      })
      .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePublish = () => {
   if (router.query.cid) {
      handleSave();
    }

    const cid = router.query.cid;
    request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${cid}/publish`, "PUT")
      .then((data) => {

        if (data.message == "Writeup published successfully") {
          window.location.href = window.location.href + "&publish=done";
        } else {
          console.log(data)
          setEditorFailure(true);
        }

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    if (router.query.cid) {
      console.log(`Deleting ${router.query.cid}...`);
      request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${router.query.cid}`, "DELETE", null)
        .then((data) => {
          if (data.message) {
            console.log("Writeup deleted successfully");
            router.push("/create?wdeleted=true"); // Update with the actual path
          } else {
            console.log("Failed to delete writeup:", data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDelete();
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

      { isPublishSaved && 
      <div className="bg-green-600 py-1 text-center text-sm text-white  mx-auto w-full ">
            <h1 className='px-4 text-lg mx-auto text-left'>🎉 Congratulations! Your writeup has been published! </h1>
          </div>
}
{ isLoading && 
      <main className='flex items-center justify-center min-h-screen text-center'>
        <div className='center text-center mx-auto'>
          <h1><i className="fas fa-spinner text-white fa-spin text-4xl mb-5"></i></h1>
          <h1 className='text-white text-xl'>Setting up CTFGuide Editor</h1>
        </div>
      </main>

}



{ editorFailure && 
      <main className='flex items-center justify-center min-h-screen text-center'>
        <div className='center text-center mx-auto'>
          <h1><i className="fas fa-exclamation-circle text-white  text-4xl mb-5"></i></h1>
          <h1 className='text-white text-xl'>CTFGuide Editor failed to load.</h1>
        </div>
      </main>

}

      { (!isLoading && !editorFailure )&& 
      <main className=''>


        <div className='text-white text-xl px-6 py-4 w-full bg-neutral-800 flex'>
          <div>
            <h1>CTFGuide Editor <span className='bg-blue-600 px-2 rounded-lg text-sm'>BETA</span></h1>
          </div>

          <div className='ml-auto text-sm '>
            <button onClick={handleDeleteClick} className='bg-red-600 px-4 py-1 mr-3 rounded-lg'><i className="fas fa-trash fa-fw"></i> Delete</button>

            <button onClick={handleSave} className='bg-indigo-600 px-4 py-1 mr-3 rounded-lg'><i className="fas fa-save fa-fw"></i> Save</button>

            {  isPublished &&
                        <button onClick={() => setPublishView(true)} className='bg-green-600 px-4 py-1 mr-3 rounded-lg'><i className="fas fa-rocket fa-fw"></i> Publish</button>
                        
                      }
          </div>
        </div>

        <div className='px-6 mx-auto'>

          <div className='flex w-full'>

    <div className='w-full'>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className='px-0 mt-2 bg-transparent border-none w-full text-white text-4xl placeholder-neutral-700 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none'
            placeholder='Enter your title here'
            autoFocus
          />
</div>
<div className='ml-auto mt-8'>
              { !isPublished &&
<span className='text-green-400 bg-green-900  rounded-full mr-2'>published</span>
}
</div>
</div>    
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
                <button onClick={() => magicSnippet()} className="toolbar-button text-white px-2 mr-1">
                <i class="fas fa-terminal"></i>
                </button>
              </div>
              <textarea
                
                value={contentPreview}
                id="content"
                placeholder="You can use Markdown here!"
                style={{ height: 'calc(100vh - 200px)' }}
                className="px-0 h-full w-full rounded-lg border-none placeholder-neutral-700 w-full bg-transparent px-5 py-4 text-white focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
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

              }


{
  isSaving && 
  <div className="bg-blue-500 center fixed bottom-6 right-6 rounded-md bg-neutral-800/50 text-sm text-white p-2">
      <i className="fas fa-spinner text-white fa-spin"></i>  Saving your work...
      </div>
}
      




{ publishView &&
<div className={`fixed inset-0 bg-black bg-opacity-70  backdrop-blur-sm z-50 `}
        >
        <div className="modal-content  w-full h-full animate__animated  animate__fadeIn">
            <div className="bg-neutral-900 bg-opacity-70  w-full h-full py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
                    <div className="mx-auto max-w-md ">
                       
                    <div

className=" pb-10 pt-4 px-4 shadow sm:px-10  bg-neutral-800"

>
<div >
<div>


<i className="fas fa-globe text-3xl text-white mt-10"></i>


  <h1 className='text-white text-xl font-semibold mt-2'>Publish your writeup</h1>
  </div>




  <p className='text-white'>Ready to publish your hard work? <br></br><br></br>Before publishing make sure you're following these rules:</p>

  <ul className='text-white ml-10 text-sm mb-10 mt-3'>
    <li>No profanity or offensive language.</li>
    <li>No content that violates DMCA regulations.</li>
    <li>No content that breaks any laws.</li>
    <li>Ensure your writeup is clear and easy to understand.</li>
    <li>Do not plagiarize. All writeups should be your own work.</li>
    <li>Respect the privacy of others. Do not share personal information without consent.</li>
  </ul>

  <button onClick={handlePublish} className='px-4 py-1 mb-10 bg-green-600 hover:bg-green-500 text-white'>Let's do it!</button> <button onClick={() => setPublishView(false)} className='ml-2 px-4 py-1 bg-yellow-600 hover:bg-yellow-500 text-white'>Nevermind.</button>


  
  <div>

  

  </div>


</div>



</div>

                        </div>
                  
                    </div>
                </div>
            </div>
        </div>

}
<Transition appear show={showDeleteModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCancelDelete}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to delete this writeup? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="duration-100 inline-flex justify-center rounded-md border border-transparent bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleConfirmDelete}
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      className="duration-100 ml-2 inline-flex justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleCancelDelete}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className=' flex w-full h-full grow basis-0'></div>
      <Footer />
    </>
  );
}