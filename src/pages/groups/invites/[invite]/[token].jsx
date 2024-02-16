import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import request from '@/utils/request';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function invite() {
  const router = useRouter();
  const { invite, token } = router.query;
  const [classroom, setClassroom] = useState({});
  const [display, setDisplay] = useState(false);

  useEffect(() => {

    const fn = async () => {
      if(invite && token) {
        const a = await validateUser(invite, token);
        if(!a) {
          window.location.href = "/dashboard";
        } else {
          setDisplay(true);
          getClassroom(invite);
        }
      }
    }

    fn();

  }, [invite, token]);

  const getClassroom = async classCode => {
    const url = `${baseUrl}/classroom/classroom-by-classcode/${classCode}`
    const data = await request(url, 'GET', null);
    if(data && data.success) {
      setClassroom(data.body);
    } else {
      console.log("Error when getting classroom info")
    }
  };

  const validateUser = async (classCode, token) => {
    try {
      const url = baseUrl+"/classroom/validate-invite-user";
      const res = await request(url, 'POST', { classCode, token });
      return res && res.success;
    } catch(err) {
      console.log(err);
      return false;
    }
  }

  const handleAccept = async () => {
    try {
      const url = baseUrl + "/classroom/join";
      const res = await request(url, 'POST', { classCode: invite, isTeacher: true });
      if(res && res.success) {
        await removeInvite();
      } else {
        console.log(res.message);
      }
    } catch(err) {
      console.log(err);
    }
  };

  const handleDecline = async () => {
    await removeInvite();
  }

  const removeInvite = async () => {
    try {
      const url = baseUrl + "/classroom/remove-invite";
      const res = await request(url, 'POST', { classCode: invite, token });
      console.log(res);
    } catch(err) {
      console.log(err);
    }
    window.location.href = "/dashboard";
  }

  return (
        <>
 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ maxWidth: '300px', textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>You have been invited to {classroom.name}</h1>
            <div style={{ padding: '1rem', backgroundColor: '#34495E', borderRadius: '8px' }}>
              {display ? (
                <div>
                  <button onClick={handleAccept} style={{ backgroundColor: '#2ECC71', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                    Accept
                  </button>
                  <button onClick={handleDecline} style={{ backgroundColor: '#E74C3C', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Decline
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </>
    );
}
