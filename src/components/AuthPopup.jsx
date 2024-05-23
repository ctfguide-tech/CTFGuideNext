import { useState, useEffect } from 'react';
import Link from 'next/link';
//import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function AuthPopup() {
  // check if firebase logged in
  const [user, setUser] = useState(false);
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
