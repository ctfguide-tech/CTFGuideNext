import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState } from 'react';
import {PatchNote} from '@/components/PatchNote';
import request from '@/utils/request';

export default function PatchNotes() {
    const[patchNotes, setPatchNotes] = useState([{
        description: "Description of the patch note",
        date: "8/4/2024",
        title: "CTFGuide Release",
        version: "Version 1.0.0"
    }]);
    
    async function getPatchNotes() {
        //fetch patch notes
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/patchNotes`, 'GET', null);
        if(!response.error) {
        setPatchNotes(response);
        }
    }

    useEffect(() => {
        getPatchNotes();
    }, []);

    console.log('patchNotes:', patchNotes);

return (
    <>
        <Head>
            <title>Patch Notes - CTFGuide</title>
            <meta
                name="description"
                content="Cybersecurity made easy for everyone"
            />
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
            </style>
        </Head>

        <StandardNav/>
        <div className=' mt-8 mx-auto max-w-7xl '>
            <h1 className='text-2xl align-middle text-left font-bold text-white'>
                Patch Notes
            </h1>
            <h2 className='text-xl text-white text-left align-middle font-bold'>
                A changelog of updates to the <span className='text-blue-600'>CTFGuide</span> platform
            </h2>
            {patchNotes &&
                patchNotes.map((patchNote) => {
                    return (
                        <PatchNote description={patchNote.description} date={patchNote.date} title={patchNote.title} version={patchNote.version}/>
                    );
                })
            }
           <PatchNote description ="we did a whole lot!" date="7/31/24" title="CTFGuide Release" version="Version 1.0.0"/>
        </div>
        <div className='flex w-full h-full grow basis-0'></div>
        <Footer />
    </>
);
}
