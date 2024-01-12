import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect } from 'react';
import { Header } from '@/components/Header';

export default function Subscribe() {
    return (
        <>
            <Head>
                <title>Subscribe - CTFGuide</title>
                <meta
                    name="description"
                    content="Cybersecurity made easy for everyone"
                />
                <style>
                    @import
                    url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <div className='mx-auto text-white max-w-6xl py-9'>
                <h1 className='font-bold text-center text-5xl'>
                    CTFGuide <span className='text-blue-600'>Pro</span>
                </h1>
                <h2 className='font-semibold text-center text-xl'>Get started with a CTFGuide Pro subscription that works for you.</h2>
            </div>
            <div className='grid-cols-2 grid-rows-1 max-w-6xl mx-auto grid gap-4'>
                <div className='mb-2 rounded border-2 border-blue-600 bg-neutral-800/50 px-3 py-3 text-white'>
                    <h1 className='text-center text-2xl font-bold'>CTFGuide Pro Monthly</h1>
                    <h2 className='text-center text-lg '>• Access to more powerful, virtualized Kubernetes containers</h2>
                    <h2 className='text-center text-lg '>• Customized images</h2>
                    <h2 className='text-center text-lg '>• Blue name colors on comments, profile page, etc</h2>
                    <h2 className='text-center text-lg '>• A cool badge on your profile to show your support!</h2>
                    <h2 className='pl-4 pt-8'><span className='text-left font-bold text-2xl'>Billed: $4.99</span><span className='text-left text-lg text-slate-400'>/mo</span></h2>
                    <h2 className='pl-4'><span className='text-left text-lg text-slate-400'>Prices are marked in USD</span></h2>
                    <div className='pt-4'>
                        <button
                            type="submit"
                            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                <div className='mb-2 rounded border-2 border-yellow-600 bg-neutral-800/50 px-3 py-3 text-white'>
                    <h1 className='text-center text-2xl font-bold pr-5'>CTFGuide Pro Yearly</h1>
                    <h2 className='text-center text-lg '>• Everything that Monthly gives</h2>
                    <h2 className='text-center text-lg '>• Gold name colors on comments, profile page, etc</h2>
                    <h2 className='text-center text-lg '>• A <span className='text-yellow-600'>even cooler</span> badge on your profile to show your support!</h2>
                    <br></br>
                    <br></br>
                    <br></br>
                    <h2 className='pl-4 pt-5'><span className='text-left font-bold text-2xl'>Billed: $54.99</span><span className='text-left text-lg text-slate-400'>/yr</span></h2>
                    <h2 className='pl-4'><span className='text-left text-lg text-slate-400'>Prices are marked in USD</span></h2>
                    <div className='pt-4'>
                        <button
                            type="submit"
                            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Subscribe
                        </button>
                    </div>

                </div>
            </div>
            <div className='pt-8'>
                <div className='mx-auto max-w-6xl ' style={{ backgroundColor: '#212121' }}>
                    <h1 className='text-white font-bold text-2xl pl-4'>Frequently asked questions</h1>
                    <ul className='text-white'>
                        <li>
                            <details>
                                <summary className='font-bold text-xl pl-5'>How do I cancel my subscription?</summary>
                                <p className='font-semibold text-lg pl-5 text-blue-600'>Instructions on how to cancel your subscription.</p>
                            </details>
                        </li>
                        <li>
                            <details >
                                <summary className='font-bold text-xl pl-5'>How do refunds work?</summary>
                                <p className='font-semibold text-lg pl-5 text-blue-600'>Information about the refund process.</p>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>

            <Footer />
        </>
    )
};