import { useState, useEffect } from "react";

export function MarkDone({sublesson, section}) {
    const [marked, useMarked] = useState(false)

    // Sublesson is the sublesson id
    const handleSubmit = () => {
        useEffect(() => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/sublesson/${sublesson}/progress/${section}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("idToken"),
                },
            })
            .then((res) => res.json())
            .catch((err) => {
                // Trigger Unauthenticated Popup
            });
        }, [])
    };

    return (
        <>
            <button onClick={handleSubmit()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{ marginTop: "1rem" }}>Mark Done</button>
        </>
    )
}