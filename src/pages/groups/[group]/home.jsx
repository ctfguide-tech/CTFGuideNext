import { useEffect, useState } from 'react';
import TeacherView from '@/components/groups/teacherView';
import { useRouter } from 'next/router';
import StudentView from '@/components/groups/studentView';
import Link from 'next/link';
import Head from 'next/head';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import request from "@/utils/request";

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
      const url = `${baseUrl}/classroom/auth/${group}`;
      const res = await request(url, 'GET', null);

      if(res && res.success){
        setViewAsTeacher(res.isTeacher);
      } else {
        router.push('/groups');
      }
    } catch (err) {
      console.error('Permission check failed:', err);
      router.push('/groups');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-neutral-400">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (viewAsTeacher === null && !isLoading) {
    return (
      <>
        <Head>
          <title>Page Not Found - CTFGuide</title>
          <meta
            name="description"
            content="Cybersecurity made easy for everyone"
          />
        </Head>
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Classroom Not Found
            </h1>
            <p className="text-neutral-400 mb-6">
              The classroom you're looking for doesn't exist or you don't have permission to access it.
            </p>
            <Link
              href="/groups"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
              legacyBehavior>
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Classrooms
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{viewAsTeacher ? 'Teacher Dashboard' : 'Student Dashboard'} - CTFGuide</title>
      </Head>
      {viewAsTeacher ? (
        <TeacherView group={group} />
      ) : (
        <StudentView group={group} />
      )}
    </>
  );
}
