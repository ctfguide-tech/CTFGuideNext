import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function AuthPopup() {
  // check if firebase logged in
  const [user, setUser] = useState(false);
  const auth = getAuth();
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setUser(false);
      } else {
        setUser(false);
      }
    });
  });
  if (user) {
    return <div>{/*User logged in*/}</div>;
  } else {
    // User logged out
    return (
      <div className="hidden rounded-md bg-[#3B82F6] hover:bg-[#468dff]">
        <Link href="/login">
          <div className="mx-auto my-auto flex h-10 text-center">
            <h1 className="mx-auto my-auto text-lg font-semibold text-white">
              Log in to see your progress!
            </h1>
          </div>
        </Link>
      </div>
    );
  }
}
