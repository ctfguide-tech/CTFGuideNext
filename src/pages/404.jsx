import Link from "next/link";
import Head from 'next/head';

const NotFound = () => {
    return (
        <>
            <Head>
                <title>Page Not Found!</title>
                <meta
                    name="description"
                    content="Cybersecurity made easy for everyone"
                />
                <style>
                @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <div className="grid h-screen place-items-center place-items-center">
                <div>
                    <Link href="/">
                        <h1 className='text-lg text-white mx-auto my-auto font-semibold'>We couldn't find this page!</h1>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default NotFound;