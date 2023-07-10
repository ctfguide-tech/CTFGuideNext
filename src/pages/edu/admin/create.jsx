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
        <h1 className='text-white text-2xl ' contentEditable>Lab Name</h1>
                    <p className='text-white' contentEditable>Lab Description</p>

                    <input type="file" className='text-white mt-4'></input>

                    <button className='px-2 py-1 bg-blue-600 text-white'>Start Lab Preview</button>
        </div>
      
      </div>
 
    </div>


                   

                            
                            

                        
                    </div>

              

                 
                </div>



            </div>

            <Footer />
        </>
    );
}
