import Head from 'next/head'
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { useEffect, useState } from 'react'
import { LearnNav } from '@/components/learn/LearnNav'
import QuizPage from '@/components/learn/QuizPage'

export default function Dashboard() {
    const [quizPage, setQuizPage] = useState(1);

    const router = useRouter();

    // Get the `quizPage` query param from the URL, default to 1
    useEffect(() => {
        const page = parseInt(router.query.quizPage, 10) || 1;
        if (page !== quizPage) {
          setQuizPage(page);
        }
    }, [router.query.quizPage]);

    const quizData = [
      {
        "question": "What is Cryptography?",
        "answers": [
        "The practice of securing information by transforming it into an unreadable format using various mathematical algorithms and techniques",
        "The process of decoding encrypted messages",
        "The process of breaking into a computer system",
        "The study of secret codes used in ancient times"
        ],
        "solution": "The practice of securing information by transforming it into an unreadable format using various mathematical algorithms and techniques"
      },
      {
        "question": "What are the two main types of cryptography?",
        "answers": [
        "Symmetric-key cryptography and asymmetric-key cryptography",
        "Hashing and salting",
        "Social engineering and phishing",
        "Encryption and decryption"
        ],
        "solution": "Symmetric-key cryptography and asymmetric-key cryptography"
      },
      {
        "question": "Which type of cryptography involves the use of a single shared secret key?",
        "answers": [
        "Symmetric-key cryptography",
        "Asymmetric-key cryptography",
        "Hashing",
        "None of the above"
        ],
        "solution": "Symmetric-key cryptography"
      },
      {
        "question": "Which type of cryptography involves the use of two keys: a public key and a private key?",
        "answers": [
        "Symmetric-key cryptography",
        "Asymmetric-key cryptography",
        "Hashing",
        "None of the above"
        ],
        "solution": "Asymmetric-key cryptography"
      },
      {
        "question": "Which cryptographic algorithm is commonly used for encrypting data in transit on the internet?",
        "answers": [
        "RSA",
        "AES",
        "SSL",
        "SHA-256"
        ],
        "solution": "SSL"
      },
      {
        "question": "What is the purpose of a digital signature in cryptography?",
        "answers": ["To verify the authenticity and integrity of digital documents", "To encrypt data", "To exchange secret keys between parties", "None of the above"],
        "solution": "To verify the authenticity and integrity of digital documents"
      }
    ];

    return (
        <>
            <Head>
                <title>Cryptography! - CTFGuide</title>
                <meta
                    name="description"
                    content="Cybersecurity made easy for everyone"
                />
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='text-white text-5xl mt-4 font-semibold mt-6'>Cryptography!</h1>
                    <div className="flex  max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav navElements={[{href: "/learn/ch3/preview", title: "Cryptography!"}, {href: "/learn/ch3/video3", title: "PKI Introduction"}, {href: "/learn/ch3/activity3", title: "Knees Deep into TLS"}, {href: "/learn/ch3/dynamic3", title: "Password Dump"}]}/>

                    {/* Main content area */}
                    <QuizPage totalQuizPages={6} sublesson={11} quizPage={quizPage} quizData={quizData} nextPage={"./dynamic3"}/>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
