import { MarkdownViewer } from "@/components/MarkdownViewer";
import { StandardNav } from "@/components/StandardNav";
import request from "@/utils/request";
import { Dialog } from "@headlessui/react";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import ReactMarkdown from "react-markdown";

export default function Challenge() {
  const router = useRouter();
  // I hate this
  const [urlChallengeId, urlSelectedTab] = (router ?? {})?.query?.id ?? [undefined, undefined];

  // Very primitive cache system
  const [cache, _setCache] = useState({});
  const setCache = (name, value) => {
    const newCache = { ...cache };
    newCache[name] = value;
    _setCache(newCache);
  }

  // Tab system is designed to keep browser state in url,
  // while mainting persistence of the terminal.
  const tabs = {
    'description': { text: 'Description', element: DescriptionPage, },
    'write-up': { text: 'Write Up', element: WriteUpPage, },
    'hints': { text: 'Hints', element: WriteUpPage, },

  }
  const selectedTab = tabs[urlSelectedTab] ?? tabs.description;

  useEffect(() => {
    if (!urlChallengeId) {
      return;
    }
    (async () => {
      if (cache.challenge) {
        return;
      }
      try {
        const getChallengeByIdEndPoint = `${process.env.NEXT_PUBLIC_API_URL}/challenges/${urlChallengeId}`;
        const getChallengeResult = await request(getChallengeByIdEndPoint, "GET", null);
        if (getChallengeResult.success) {
          setCache("challenge", getChallengeResult.body);
        }
      } catch (error) { throw "Failed to fetch challenge: " + error; }
    })();
  }, [urlChallengeId]);

  const [loadingFlagSubmit, setLoadingFlagSubmit] = useState(false);
  const onSubmitFlag = (e) => {
    e.preventDefault();
    if (loadingFlagSubmit) {
      return;
    }
    const formElements = e.target.elements;
    const flag = formElements.flag.value;
    setLoadingFlagSubmit(true);
    (async () => {
      try {
        const submitChallengeEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/challenges/${urlChallengeId}/submissions`;
        const submitChallengeResult = await request(submitChallengeEndpoint, 'POST', { keyword: flag });
        console.log(submitChallengeResult)
        const { success, incorrect, error } = submitChallengeResult ?? {};
        if (error || !submitChallengeResult) {
          // An error occurred >:(
          alert(error);
          return;
        }
        if (incorrect) {
          // Incorrect
          alert(incorrect);
          return;
        }
        // Success
        alert(success);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFlagSubmit(false);
      }
    })();
  }

  return (
    <>
      <Head>
        <title>Challenge - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <FlagDialog />
      <div className='flex flex-col min-w-[64rem] text-white overflow-x-auto overflow-y-hidden min-h-0 h-screen'>
        <StandardNav alignCenter={false} />
        <main className="flex flex-grow p-2 gap-2 overflow-y-hidden">
          <div className="flex flex-col flex-1 bg-neutral-800 overflow-y-hidden rounded-md">
            <div className="flex shrink-0 p-1 items-center gap-1 bg-neutral-700 h-12 w-full">
              {Object.entries(tabs).map(([url, tab]) => <TabLink tabName={tab.text} selected={selectedTab === tab} url={`/challenges/${urlChallengeId}/${url}`} key={url} />)}
            </div>
            {/* Only this element should rerender on tab switch */}
            {<selectedTab.element cache={cache} setCache={setCache} />}
          </div>
          <div className="flex flex-col flex-1 bg-neutral-800 overflow-hidden rounded-md">
            <div className="grow bg-neutral-950 w-full">
            </div>
            <div className="shrink-0 bg-neutral-800 h-12 w-full">
              <form action="" method="get" onSubmit={onSubmitFlag} className="flex p-1 gap-2 h-full">
                <input name="flag" type="text" required placeholder="Flag..." className="text-black h-full p-0 rounded-sm grow px-2 w-1/2" />
                <input name="submitFlag" type="submit" value="Submit Flag" disabled={loadingFlagSubmit} className="h-full border border-green-500/50 hover:border-green-200/50 bg-green-600 hover:bg-green-500 disabled:bg-neutral-800 disabled:text-neutral-400 disabled:border-neutral-500/50 transition-all text-green-50 cursor-pointer disabled:cursor-default px-2 rounded-sm" />
              </form>
            </div>
          </div>
        </main >
      </div>
    </>
  )
}

function FlagDialog({ color, title, message }) {
  let [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog
      open={isOpen}
      onClose={() => undefined}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Full-screen scrollable container */}
      <div className="fixed inset-0 w-screen overflow-y-auto">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="mx-auto p-8 max-w-sm rounded bg-neutral-900 text-white">
            <Dialog.Title>{title}</Dialog.Title>
            <p>{message}</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog >
  )
}

function TabLink({ tabName, selected, url }) {
  const selectedStyle = selected ? 'text-white bg-neutral-600' : 'text-neutral-400';
  return (
    <Link href={url} className={`flex justify-center items-center ${selectedStyle} hover:text-white px-2 hover:bg-neutral-600 rounded-sm h-full`}>
      <DocumentTextIcon className="text-blue-500 w-6 mr-1 inline-flex" />
      {tabName ?? 'This is a test button'}
    </Link>
  )
}

function DescriptionPage({ cache }) {
  const { challenge } = cache;
  const colorText = {
    'BEGINNER': 'bg-blue-500 text-blue-50',
    'EASY': 'bg-green-500 text-green-50',
    'MEDIUM': 'bg-orange-500 text-orange-50',
    'HARD': 'bg-red-500 text-red-50',
    'INSANE': 'bg-purple-500 text-purple-50',
  };
  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h1 className="text-4xl font-semibold py-2 line-clamp-1">
          {challenge ? challenge.title : <Skeleton baseColor="#333" highlightColor="#666" />}
        </h1>
        <h2 className="flex flex-wrap gap-2 pb-2">
          {challenge ? (
            <>
              {<Tag bgColor={colorText[challenge.difficulty]} textColor="font-bold">{challenge.difficulty.toLowerCase()}</Tag>}
              {challenge.category.map((s) => <Tag key={s}>{s}</Tag>)}
            </>)
            : <Skeleton baseColor="#333" highlightColor="#666" width='20rem' />}
        </h2>
        <h2 className="flex gap-2 pb-8">
          {challenge ? <>
            <Link href={`/users/${challenge.creator}`} className="text-blue-500 pr-3 hover:underline">{challenge.creator} </Link>
            <p className="flex text-neutral-200 opacity-70 items-center text-sm">
              <i className="fas fa-solid fa-eye mr-2 text-lg"></i>
              {challenge.views}
              <i className="ml-4 mr-2 text-neutral-300 fas fa-solid fa-heart text-lg"></i>
              {challenge.upvotes}
            </p>
          </>
            : <Skeleton baseColor="#333" highlightColor="#666" width='20rem' />}
        </h2>
        <ReactMarkdown></ReactMarkdown>
        {challenge ? <MarkdownViewer content={challenge.content}></MarkdownViewer> : <Skeleton baseColor="#333" highlightColor="#666" count={8} />}
      </div >
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}

function Tag({ bgColor = 'bg-neutral-700', textColor = 'text-neutral-50', children }) {
  return <p className={`${bgColor} ${textColor} capitalize rounded-sm px-2`}>{children}</p>
}

function WriteUpPage({ cache, setCache }) {
  useEffect(() => {
    (async () => {
      if (cache['write-page']) {
        return;
      }
      setCache('write-page', {});
    })();
  })
  return (
    <>
    <div className="flex">
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h2 className="text-2xl font-semibold pt-2">Write Ups</h2>
      </div>
      <div className="ml-auto">
        <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-2 py-1 mt-3 mr-2">Create a Write up</button>
      </div>
      </div>
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}
