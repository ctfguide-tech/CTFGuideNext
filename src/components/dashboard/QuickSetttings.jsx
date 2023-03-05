
import Container from '@/components/Container';
import { useState, useEffect } from 'react';


export function QuickSettings() {

    const [banner, bannerState] = useState(false);

    useEffect(() => {


        fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("idToken"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                document.getElementById("bio").value = data.bio;
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    function saveBio() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("idToken"),
            },
            body: JSON.stringify({
                bio: document.getElementById("bio").value,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                document.getElementById("bio").value = data.bio;
                bannerState(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    return (
        <>
            <h1 className="text-xl text-white tracking-tight mt-10    " style={{ color: "#595959" }}> YOUR BIO</h1>
            <textarea id="bio" onChange={() => bannerState(true)} style={{ backgroundColor: "#212121" }} readOnly={false} className='mt-2 border-none rounded-lg text-white w-full'>

            </textarea>

            {banner && (
                <div style={{ backgroundColor: "#212121" }} id="savebanner" className="fixed inset-x-0 bottom-0 flex flex-col justify-between gap-y-4 gap-x-8 p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8">
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
                        <button onClick={() => bannerState(false)} type="button" className="text-xl font-semibold leading-6 text-white">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </>
    )
}
