import { StandardNav } from "@/components/StandardNav";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Challenge() {
  const router = useRouter();
  if (!router.isReady) {
    return <div></div>
  }
  const [urlChallengeId, urlSelectedTab] = router.query.id;

  const tabs = {
    'description': { text: 'Description', element: DescriptionPage },
    'write-up': { text: 'Write Up', element: WriteUpPage },
  }

  const selectedTab = tabs[urlSelectedTab] ?? tabs.description;

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
      <div className='flex flex-col min-w-[64rem] text-white overflow-x-auto overflow-y-hidden min-h-0 h-screen'>
        <StandardNav alignCenter={false} />
        <main className="flex flex-grow p-2 gap-2 overflow-y-hidden">
          <div className="flex flex-col flex-1 bg-neutral-800 overflow-y-hidden rounded-md">
            <div className="flex shrink-0 p-1 items-center bg-neutral-700 h-12 w-full">
              {Object.entries(tabs).map(([url, tab]) => <TabLink tabName={tab.text} selected={urlSelectedTab == url} url={`/challenges/${urlChallengeId}/${url}`} key={url} />)}
            </div>
            {<selectedTab.element />}
          </div>
          <div className="flex flex-col flex-1 bg-neutral-800 overflow-hidden rounded-md">
            <div className="grow bg-neutral-950 w-full"></div>
            <div className="shrink-0 bg-neutral-800 h-10 w-full">Submit Flag</div>
          </div>
        </main >
      </div>
    </>
  )
}

function TabLink({ tabName, selected, url }) {
  return (
    <Link href={url} className="flex justify-center items-center text-white px-2 hover:bg-neutral-600 rounded-sm h-full">
      <DocumentTextIcon className="text-blue-500 w-6 mr-1 inline-flex" />
      {tabName ?? 'This is a test button'}
    </Link>
  )
}

function DescriptionPage() {
  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h2 className="text-2xl font-semibold pt-2">Title of the challenge</h2>
        <p>Creator (tags tags tags)</p>
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
        This is scrollable content.<br />
      </div>
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}

function WriteUpPage() {
  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h2 className="text-2xl font-semibold pt-2">Write Up Page</h2>
      </div>
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}
