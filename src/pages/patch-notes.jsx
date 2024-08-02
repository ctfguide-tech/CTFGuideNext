import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState } from 'react';
import {PatchNote} from '@/components/PatchNote';

export default function PatchNotes() {
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
           <PatchNote description ="we did a whole lot!" date="7/31/24" title="CTFGuide Release" version="Version 1.0.0"/>
        </div>
        <div className='flex w-full h-full grow basis-0'></div>
        <Footer />
    </>
);
}
