


import { useEffect, useState } from 'react';
import TeacherView from '@/components/groups/teacherView';
import { useRouter } from 'next/router';
import StudentView from '@/components/groups/studentView';
import Link from 'next/link';
import Head from 'next/head';
export default function GroupDisplay() {
    const baseUrl = "http://localhost:3001";

    const router = useRouter();
    const { uid, group } = router.query;
    const [viewAsTeacher, setViewAsTeacher ] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(uid && group) {
            const userUid = localStorage.getItem('uid');
            if(userUid !== uid) {
                window.location.href = "/groups";
            } else {
                checkPermissions();
            }
        }
    }, [uid, group]);


    const checkPermissions = async () => {
        try {
            const url = `${baseUrl}/classroom/check-if-teacher`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({classCode: group, uid: uid})
            });
            const res = await response.json();
            if(res.success) {
                setViewAsTeacher(res.isTeacher);
                console.log(res.message)
            }
          } catch(err) {
            console.log(err);
          }
          setIsLoading(false);
    }

    return (
            viewAsTeacher === null && !isLoading ? <>
            <Head>
            <title>Page Not Found!</title>
            <meta
                name="description"
                content="Cybersecurity made easy for everyone"
            />
            <style>
                @import
                url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
            </style>
            </Head>
            <div className="grid h-screen place-items-center place-items-center">
            <div>
                <Link href="/">
                <h1 className="mx-auto my-auto text-lg font-semibold text-white">
                    We couldn't find this page!
                </h1>
                </Link>
            </div>
            </div>
        </>
        : viewAsTeacher ? <TeacherView uid={uid} group={group} />
        : !isLoading ? <StudentView uid={uid} group={group} />
        : <></>
    );
}
