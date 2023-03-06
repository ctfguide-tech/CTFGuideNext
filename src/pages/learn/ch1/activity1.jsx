import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Stats } from '@/components/dashboard/Stats'
import { Developer } from '@/components/dashboard/Developer'
import { Performance } from '@/components/dashboard/Performance'
import { useEffect } from 'react'
import { Friends } from '@/components/dashboard/Friends'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LearnNav } from '@/components/learn/LearnNav'
import { QuickSettings } from '@/components/dashboard/QuickSetttings'
import { Suggest } from '@/components/dashboard/Suggest'
import { ProgressBar  } from '@tremor/react'
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
    const [open, setOpen] = useState(true)
    const [markdown, setMarkdown] = useState("");


    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md");
          const data = await response.text();
          setMarkdown(data);
        };
        fetchData();
      }, []);

    return (



        <>
            <Head>
                <title>Learn - CTFGuide</title>
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
                    <h1 className='text-white text-5xl mt-4 font-semibold mt-6'>Linux Basics</h1>
                    <div className="flex h-screen max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav/>

                    {/* Main content area */}
                    <div className="flex-1 text-white">

                        {/* Load in markdown from a github url */}
                        <h1 className='mt-10 text-3xl font-semibold'>Mastery Task</h1>
                        <hr className='mb-5 mt-2'></hr>
                        <div style={{ backgroundColor: "#212121", padding: "1rem", borderRadius: "0.5rem" }}>
  <h2 style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Question:</h2>
  <p style={{ color: "white", fontSize: "1.25rem", marginBottom: "1rem" }}>Example of Question</p>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
    <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
      <input type="radio" id="option1" name="answer" value="option1" style={{ marginRight: "0.5rem" }} />
      <label htmlFor="option1" style={{ color: "white", fontSize: "1.25rem" }}>1</label>
    </div>
    <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
      <input type="radio" id="option2" name="answer" value="option2" style={{ marginRight: "0.5rem" }} />
      <label htmlFor="option2" style={{ color: "white", fontSize: "1.25rem" }}>2</label>
    </div>
    <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
      <input type="radio" id="option3" name="answer" value="option3" style={{ marginRight: "0.5rem" }} />
      <label htmlFor="option3" style={{ color: "white", fontSize: "1.25rem" }}>3</label>
    </div>
    <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
      <input type="radio" id="option4" name="answer" value="option4" style={{ marginRight: "0.5rem" }} />
      <label htmlFor="option4" style={{ color: "white", fontSize: "1.25rem" }}>4</label>

    </div>


  </div>

  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{ marginTop: "1rem" }}>Submit</button>
</div>

                    </div>
                    </div>


                </div>
            </main>
            <Footer />
        </>
    )
}
