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
    if (error) return <div className='text-red-400'>API Error: {error}</div>;

    return(
        <div className="mt-4 rounded-sm">
            {writeups.length > 0 ? (
       
                 

<div className="overflow-auto">
        {writeups.map((writeup, index) => (
          <div key={index} onClick={() => setSelectedWriteup(writeup)} className='mb-1 bg-neutral-700 hover:bg-neutral-600 hover:cursor-pointer px-5 py-3 w-full text-white flex mx-auto border border-neutral-600'>
            <div className='w-full flex'>
              <div className="">

                  <h3 className="text-2xl">{writeup.title}</h3>
                  <p className="text-sm">Authored by {user.username}</p>

                </div>
                <div className="ml-auto mt-2">
                  <p className="text-sm text-right">452 views</p>

                  <div className=" space-x-2 text-right text-lg">
                    <i className="fas fa-arrow-up text-green-500 cursor-pointer"></i> {writeup.upvotes}
                    <i className="fas fa-arrow-down text-red-500 cursor-pointer"></i>  {writeup.downvotes}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
            
            ) : (
                <div className="align-center duration-4000 col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40">
                <img src={'/CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
                <h1 className="mx-auto mt-2 text-center text-xl text-white">No Writeups Created Yet...</h1>
              </div>
            )}
        </div>
    );
};

export default Writeups;