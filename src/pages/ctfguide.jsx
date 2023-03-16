import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Scroll } from '@/components/ctfguide/Scroll';

export default function CTFGuide() {
    const ref = useRef(null);
    const { scrollXProgress } = useScroll({ container: ref });
  return (
    <>
      <Head>
        <title>CTFGuide</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <main>
        <div className="w-full backdrop-blur-lg bg-[url('https://camo.githubusercontent.com/f38cb60cf74f6e673504cbde590a1481018dd3bcb83d4307b3f20bb2a4a992f7/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f636f6e63656e747269635f636972636c65732e706e67')]">
            <div className="flex mx-auto text-center h-28 my-auto">
                <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>CTF Guide</h1>
            </div>
        </div>
        <Scroll />
      </main>
    </>
  );
}
