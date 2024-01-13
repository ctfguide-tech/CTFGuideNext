import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { getAuth } from 'firebase/auth';
import { loadStripe } from '@stripe/stripe-js';


const auth = getAuth();

const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export default function CancelSubscription() {
    return(
        <>
        <Head>
                <title>Cancel Subscription - CTFGuide</title>
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
            <div className='max-w-6xl text-white'>
                <h1 className='text-xl text-left font-bold'>Cancel Your Subscription</h1>

            </div>
        
        </>
    )

};