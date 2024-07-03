import request from "@/utils/request";
import { useRouter } from 'next/router';

export default function Menu({ open, setOpen, solvedChallenges }) {
    

    const router = useRouter();

    const hideModal = () => setOpen(false);

    const createWriteup = () => {
      request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/create`, 'POST', {
        title: "Writeup Title", 
        content: "Writeup Content",
        tags: "Writeup Tags",
        challengeId: document.querySelector('select').value,
      }).then(res => {
        router.push(`/create/editor?cid=${res.writeUp.id}`)
      }
      )
    };
    const handleBackgroundClick = () => {
     
          hideModal();
    
  };



    return (
        <div className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 ${open ? '' : 'hidden'}`} 
        >
        <div className="modal-content  w-full h-full animate__animated  animate__fadeIn">
            <div className="bg-neutral-900 bg-opacity-70  w-full h-full py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
                    <div className="mx-auto max-w-md ">
                       
                    <div

className=" pb-10 pt-4 px-4 shadow sm:px-10  bg-neutral-800"

>
<div className="space-y-6">
  <div
    id="error"
    className="tex†-white hidden rounded bg-red-500 px-4 py-1"
  >
    <h1 className="text-center text-white" id="errorMessage">
      Something went wrong.
    </h1>
  </div>

  <h1 className='text-white text-xl font-semibold'>Create a writeup</h1>

  <p className='text-white'>Choose a challenge that you want to create a writeup for.</p>
  {
  solvedChallenges.length > 0 ? (
    <select className='bg-neutral-900 text-white border-none text-sm py-1 w-full'>
      {
        solvedChallenges.map((challenge, index) => (
          <option key={index} value={challenge.id} className="text-white">{challenge.slug}</option>
        ))
      }
    </select>
  ) : (
    <p className='text-neutral-200 text-center'>You haven't solved any challenges yet.</p>
  )
}





  <p className='text-sm text-yellow-500 italic'>Psst, you'll need to solve the challenge before uploading a writeup for it.</p>

  {
  solvedChallenges.length > 0 && (
    <>
      <button onClick={createWriteup} className='bg-blue-600 hover:bg-blue-500 w-full py-2 text-white'>Create</button>
      <div></div>
    </>
  )
}
  <div>
  

  </div>


</div>



</div>

                        </div>
                  
                    </div>
                </div>
            </div>
        </div>
    )
}

