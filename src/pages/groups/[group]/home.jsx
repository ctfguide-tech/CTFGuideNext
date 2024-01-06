import { useEffect, useState } from 'react';
import TeacherView from '@/components/groups/teacherView';
import { useRouter } from 'next/router';
import StudentView from '@/components/groups/studentView';
import Link from 'next/link';
import Head from 'next/head';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function GroupDisplay() {
  const router = useRouter();
  const { group } = router.query;
  const [viewAsTeacher, setViewAsTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (group) {
      checkPermissions();
    }
  }, [group]);

  const checkPermissions = async () => {
    try {
      const userUid = localStorage.getItem('uid');
      const url = `${baseUrl}/classroom/check-if-teacher`;
      const token = localStorage.getItem('idToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ classCode: group, uid: userUid }),
      });
      const res = await response.json();
      if (res.success) {
        setViewAsTeacher(res.isTeacher);
        console.log(res.message);
      } else {
        window.location.replace('/login');
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return viewAsTeacher === null && !isLoading ? (
    <>
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
  ) : viewAsTeacher ? (
    <TeacherView group={group} />
  ) : !isLoading ? (
    <StudentView group={group} />
  ) : (
    <></>
  );
}
