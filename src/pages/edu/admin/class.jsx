import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
const people = [
    { name: 'Sample Assignment', title: 'Due 9/12/23' },
    // More people...
  ]

  
export default function ComingSoon() {
    return (
        <>
            <Head>
                <title>Coming Soon - CTFGuide</title>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />
            <div className=" min-h-screen  ">



                <div className="mx-auto mt-10 max-w-6xl">

                    <h1 className='text-white text-3xl'>Pennsylvania State University</h1>
                    <div className='px-4 py-4  mt-4 bg-neutral-800 rounded-lg  '>


               
                    
                    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
        <h1 className='text-white text-2xl'>Assigned</h1>
                    <p className='text-white'>List of assignments you've assigned</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create Assignment
          </button>
        </div>
      </div>
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
Assignment Name                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Date Due
                  </th>
               
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                      {person.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white">{person.title}</td>
               <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-blue-600 hover:text-blue-900">
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>


                   

                            
                            

                        
                    </div>

              

                    <div className='px-4 py-4  mt-4 bg-neutral-800 rounded-lg  '>


               
                    
<div className="">
<div className="sm:flex sm:items-center">
<div className="sm:flex-auto">
<h1 className='text-white text-2xl'>Created Images</h1>
<p className='text-white'>List of lab images you've created</p>
</div>
<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
<button
type="button"
className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
>
Create Image
</button>
</div>
</div>
<p className='text-xl text-red-600 mt-4'>Nothing found.</p>
</div>




        
        

    
</div>
                </div>



            </div>

            <Footer />
        </>
    );
}
