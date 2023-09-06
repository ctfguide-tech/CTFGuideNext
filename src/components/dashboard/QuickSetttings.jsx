import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export function QuickSettings() {
  const [banner, bannerState] = useState(false);

  const router = useRouter();

  useEffect(() => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('idToken'),
        },
      })
        .then((res) => res.json())
        .then((data) => {
   
          document.getElementById('bio').value = data.bio;
        })
        .catch((err) => {
     

        });
    } catch(err) {
      window.alert('You are not logged in')
    }
  }, []);

  function saveBio() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('idToken'),
      },
      body: JSON.stringify({
        bio: document.getElementById('bio').value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        document.getElementById('bio').value = data.bio;
        bannerState(false);
      })
      .catch((err) => {
        console.log(err); 
      });
  }

  return (
    <>
      <h1 className="mt-10 text-xl text-gray-300"> Your Bio</h1>
      <textarea
        id="bio"
        onChange={() => bannerState(true)}
        style={{ backgroundColor: '#212121' }}
        readOnly={false}
        className="mt-1 w-full rounded-lg border-none text-white"
      ></textarea>

      <h1 className="mt-2 text-xl text-gray-300"> Site Feed</h1>

      <div className="mx-auto mb-4 mt-1 w-full gap-4 gap-y-6 rounded-lg">
        <div
          style={{ backgroundColor: '#212121', borderColor: '#3b3a3a' }}
          className=" mx-auto w-full rounded-lg px-4 py-2 pt-2 pb-5 text-white  "
        >
          <h1 className="mt-2 text-xl font-semibold text-white">
            {' '}
            CTFGuide V3 is out now!
          </h1>

          <p>
            {' '}
            After months of development, we are excited to release the new
            version of CTFGuide. There's a lot to unpack here!
          </p>
          <p
            id="feed1readmore"
            className=" mt-4 cursor-pointer italic text-blue-500 hover:text-blue-500 hover:underline"
            onClick={() => {
              document.getElementById('feed1rest').classList.remove('hidden');
              document.getElementById('feed1readmore').classList.add('hidden');
            }}
          >
            Read More
          </p>

          <div id="feed1rest" className="mt-4 hidden">
            <p>
              The first thing that you probably noticed, is the freshened UI.
              You'll notice that pages are a lot more wider and have a more
              friendly font.
            </p>

            <img
              src="./blog1.svg"
              className="mx-auto mt-4 mb-5 rounded-lg bg-neutral-800 py-10 px-10"
            />

            <p className="mx-auto text-center text-sm text-neutral-300">
              Old CTFGuide UI (Left) and New CTFGuide UI (Right)
            </p>

            <p className="mt-8">
              A common problem we'd have was that we artificially limited the
              amount of space we could design with. This limit is no longer
              there, meaning you should feel like the UI is more spread out.
              <br></br>
              <br></br>
              We've also introduced a lot of new features including badges,
              likes, & learn. These features will aid everyone's unique learning
              journey and we're super pumped.
              <br></br> <br></br>
              <b>Badges</b> - Badges are a way for you to show off your
              achievements on CTFGuide. You can earn badges by completing
              certain tasks on the site.
              <br></br> <br></br>
              <b>Likes</b> - Likes are a way for you to show appreciation for a
              creator or a certain area of Cybersecurity.
              <br></br> <br></br>
              <b>Learn</b> - We're super excited about this feature. We'll be
              adding a lot of content to this section in the coming weeks.
              You'll find a lot of interesting content shared from our team
              members, as well as content from other members in the Cyber
              community!
              <br></br> <br></br>
            </p>
            <p
              id="feed1readless"
              className=" mt-4 cursor-pointer italic text-blue-500 hover:text-blue-500 hover:underline"
              onClick={() => {
                document.getElementById('feed1rest').classList.add('hidden');
                document
                  .getElementById('feed1readmore')
                  .classList.remove('hidden');
              }}
            >
              See Less
            </p>
          </div>
        </div>
      </div>

      {banner && (
        <div
          style={{ backgroundColor: '#212121' }}
          id="savebanner"
          className="fixed inset-x-0 bottom-0 flex flex-col justify-between gap-y-4 gap-x-8 p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8"
        >
          <p className="max-w-4xl text-2xl leading-6 text-white">
            You have unsaved changes.
          </p>
          <div className="flex flex-none items-center gap-x-5">
            <button
              onClick={saveBio}
              type="button"
              className="rounded-md bg-green-700 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Save Changes
            </button>
            <button
              onClick={() => bannerState(false)}
              type="button"
              className="text-xl font-semibold leading-6 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
