import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';

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

                    <h1 className='text-white text-3xl'>Education</h1>
                    <div className='mt-3 bg-neutral-800 rounded-lg  hover:bg-neutral-700 cursor-pointer '>
                        <h1 className='px-4 py-4 text-left text-white text-2xl  font-semibold backdrop-blur-lg'>Pennsylvania State University</h1>


                        

                     
                    
                    </div>

                    <div className="text-white text-center mt-10">

                        <h1>Don't see your institution? Contact your IT admin.</h1>
                    </div>egrha
              
              
                </div>



            </div>

            <Footer />
        </>
    );
}
