import { useState } from "react";
import Link from 'next/link';

export function MarkDone({sublesson, section, href}) {
    const [marked, setMarked] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/sublesson/${sublesson}/progress/${section}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("idToken"),
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setMarked(true);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 4000);
        })
        .catch((err) => {
            // Trigger Unauthenticated Popup
        });
    };

    return (
        <>
            <Link href={href ? href : "./"}>
                <button onClick={handleSubmit} className="bg-[#3B82F6] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" style={{ marginTop: "1rem" }}>Mark Done</button>
            </Link>
            {showPopup && <div className="fixed center bottom-0 right-0 bg-[#3B82F6] p-2 rounded-md mr-6 ml-6">Progress Saved!</div>}
            {marked && <p></p>}
        </>
    )
}
