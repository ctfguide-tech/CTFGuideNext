import React, { useEffect, useState } from 'react';
import request from '@/utils/request';

const Writeups = ({ user }) => {
    const [writeups, setWriteups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWriteups = async() => {
            try {
                const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/writeups`, 'GET', null);
                setWriteups(response);
            }catch (err) {
                setError(err.message);
            }finally{
                setLoading(false);
            }

        };
        fetchWriteups();
        console.log(writeups.length);
    }, [user]);

    if (loading) return <div className='text-neutral-400'>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div>
            {writeups.length > 0 ? (
                <ul>
                    {writeups.map(writeup => (
                        <li key={writeup.id}>{writeup.name}</li>
                    ))}
                </ul>
            ) : (
                <div className="align-center duration-4000 col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40">
                    <img src={'/CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
                    <h1 className="mx-auto mt-2 text-center text-xl text-white">No Writeups Yet...</h1>
                </div>
            )}
        </div>
    );
};