
import Container from '@/components/Container';
import { useState, useEffect } from 'react';


export function QuickSettings() {
    const [bio, setBio] = useState("Loading...");

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
                setBio(data.bio)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])


    return (
        <>
            <h1 className="text-xl text-white tracking-tight mt-10    " style={{ color: "#595959" }}> YOUR BIO</h1>
            <textarea value={bio} style={{ backgroundColor: "#212121" }} className='mt-2 border-none rounded-lg text-white w-full'>
               
            </textarea>
        </>
    )
}
