import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import Link from 'next/link';

export function AuthPopup() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribe
    if (firebase?.auth) {
        unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            setUser(user);
        });
    }

    return unsubscribe;
  }, []);

  if (user) {
    return <div>{/*User logged in*/}</div>;
  } else {
    // User logged out
    return (
      <div className="rounded-md bg-[#3B82F6] hover:bg-[#468dff]">
        <Link href="/login">
          <div className="flex mx-auto text-center h-10 my-auto">
            <h1 className='text-lg text-white mx-auto my-auto font-semibold'>Log in to see your progress!</h1>
          </div>
        </Link>
      </div>
    );
  }
}
