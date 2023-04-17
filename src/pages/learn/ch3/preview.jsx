import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useState } from 'react';
import { LearnNav } from '@/components/learn/LearnNav';
import { MarkDone } from '@/components/learn/MarkDone';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [markdown, setMarkdown] = useState('');
  const router = useRouter();


  return (
    <>
      <Head>
        <title>Cryptography! - CTFGuide</title>
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
      <main>
        <div className="mx-auto ">
        <div
            className="  w-full backdrop-blur-lg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')",
            }}
          >
            <div className="mx-auto my-auto flex h-28 text-center backdrop-blur-md">
              <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
                Cryptography
              </h1>
            </div>
            <div className='text-center text-white bg-yellow-800 py-2'>
                <h1>This lesson will temporarily serve a general overview until our content creation team finishes the new/updated lesson. We aren't exactly pleased with the current state of this learning module.</h1>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={3}
              navElements={[
                { href: './preview', title: 'Introduction to Cryptography' },
                { href: './video3', title: 'Cryptography Outline' },
                { href: './activity3', title: 'Mastery Task' },
                { href: './dynamic3', title: 'Password Dump' },
              ]}
            />

            {/* Main content area */}
            <div className="text-white">
              {/* Load in markdown from a github url */}
              <div className='bg-neutral-800/100 my-auto  align-center flex px-4 py-4 mb-4 mt-10 border-t-4 border-blue-700'>
              <motion.h1
                className="animate-slide-in-left  text-3xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Introduction to Cryptography
              </motion.h1>
              <div className='ml-auto '>
              <button  onClick={() => { router.push('../learn') }} className='bg-neutral-900 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'>←</button>
              <button className=' bg-neutral-900  px-4 py-1 text-xl rounded-l-sm' disabled>1</button>

                <button  onClick={() => { router.push('./video3') }} className='mr-4 bg-neutral-900  hover:bg-blue-800 px-4 py-1 text-xl rounded-r-sm'>→</button>
             
                <MarkDone sublesson={9} section={1} href={'./video3'} />

              </div>
              </div>
              <hr className="mt-2 mb-4 border-gray-500"></hr>
              <h1 className="mt-2 text-2xl text-blue-500">
                What is Cryptography?
              </h1>
              <h2 className="text-md mt-2 mb-6 leading-relaxed text-white">
                Cryptography, in the context of cybersecurity, refers to the
                practice of securing information by transforming it into an
                unreadable format using various mathematical algorithms and
                techniques.
              </h2>
              <text className="leading-relaxed">
                Cryptography is widely used in the field of cybersecurity to
                protect sensitive information such as passwords, credit card
                numbers, and other personal or confidential data from
                unauthorized access, interception, or theft. In Capture The Flag
                (CTF) competitions, cryptography challenges often involve the
                use of cryptographic techniques to encrypt or decrypt messages
                or data. Participants are usually given a cipher or encryption
                algorithm, and they must use their knowledge of cryptography to
                crack the code and obtain the hidden information.
              </text>
              <hr className="mt-6 w-5/6 border-gray-500"></hr>
              <h2 className="mt-4 mb-4 text-xl text-gray-300">
                There are two main types of cryptography: symmetric-key
                cryptography and asymmetric-key cryptography.
              </h2>
              <hr className="mb-3 w-5/6 border-gray-500"></hr>
              <h1 className="mt-6 mb-1 text-2xl text-blue-500">
                Symmetric-key cryptography
              </h1>
              Symmetric-key cryptography involves the use of a single shared
              secret key that is used both to encrypt and decrypt data. The same
              key must be known by both the sender and the receiver in order for
              them to securely communicate with each other. Examples of
              symmetric-key algorithms used in CTF challenges include Caesar
              Cipher, Vigenère Cipher, and the Advanced Encryption Standard
              (AES).
              <img
                width="300"
                className="mx-auto mt-10 text-center"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F4a%2FCaesar_cipher_left_shift_of_3.svg%2F1200px-Caesar_cipher_left_shift_of_3.svg.png&f=1&nofb=1&ipt=2258421a3b3a3569414816e2b96a633a952d4bd62657431c546346e81234c5b1&ipo=images"
              ></img>
              <h2 className="text-md mt-2 mb-4 text-center italic text-gray-300">
                In the Caeser Cipher, alphabetical values are shifted by a
                certain amount.
              </h2>
              <h1 className="mt-6 mb-1 text-2xl text-blue-500">
                Asymmetric-key cryptography
              </h1>
              Asymmetric-key cryptography, also known as public-key
              cryptography, involves the use of two keys: a public key and a
              private key. The public key is used to encrypt data, while the
              private key is used to decrypt it. The private key must be kept
              secret by the owner, while the public key can be shared with
              anyone. Examples of asymmetric-key algorithms used in CTF
              challenges include RSA and Elliptic Curve Cryptography (ECC).
              <h1 className="mt-6 mb-1 text-2xl text-blue-500">
                Other use cases?
              </h1>
              In addition to encryption and decryption, cryptography is also
              used for other purposes such as digital signatures, key exchange,
              and authentication. Digital signatures are used to verify the
              authenticity and integrity of digital documents, while key
              exchange is used to securely exchange secret keys between parties.
              Authentication is used to verify the identity of a user or system
              before granting access to protected resources.
              <div className="mx-auto mt-8 mb-4 w-2/3 rounded-sm bg-[#212121]">
                <h1 className="px-6 pt-4 pb-2 leading-relaxed">
                  To succeed in CTF cryptography challenges, participants need a
                  strong understanding of cryptographic principles and
                  techniques, as well as proficiency in using a range of tools
                  and software for analyzing and cracking ciphers. Some of the
                  most commonly used tools in CTF cryptography challenges
                  include frequency analysis tools, hash cracking tools, and
                  cipher identification tools. Overall, CTF cryptography
                  challenges offer an exciting and challenging way to test and
                  develop skills in cryptography and cybersecurity, and provide
                  valuable experience for those pursuing careers in these
                  fields.
                </h1>
           
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
