import React, { useEffect, useState } from 'react';
import request from '@/utils/request';
import { Dialog } from '@headlessui/react';

const Writeups = ({ user }) => {
    const [writeups, setWriteups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWriteup, setSelectedWriteup] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchWriteups = async () => {
            if (writeups.length > 0) {
                setLoading(false);
                return;
            }

            try {
                const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/writeups`, 'GET', null);
                setWriteups(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWriteups();
    }, [user]);

    const openModal = (writeup) => {
        setSelectedWriteup(writeup);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWriteup(null);
    };

    if (loading) return <div className='text-neutral-400'>Loading...</div>;
    if (error) return <div className='text-red-400'>API Error: {error}</div>;

    return (
        <div className="mt-4 rounded-sm">
            {writeups.length > 0 ? (
                <div className="overflow-auto">
                    {writeups.map((writeup, index) => (
                        <div key={index} onClick={() => openModal(writeup)} className='mb-1 bg-neutral-700 hover:bg-neutral-600 hover:cursor-pointer px-5 py-3 w-full text-white flex mx-auto border border-neutral-600'>
                            <div className='w-full flex'>
                                <div className="">
                                    <h3 className="text-2xl">{writeup.title}</h3>
                                    <p className="text-sm">Authored by <span onClick={() => window.location.href = `../../users/${user.username}`} className='text-blue-500 cursor-pointer'>{user.username}</span></p>
                                </div>
                                <div className="ml-auto mt-2">
                                    <p className="text-sm text-right">{writeup.views} views</p>
                                    <div className="space-x-2 text-right text-lg">
                                        <i className="fas fa-arrow-up text-green-500 cursor-pointer"></i> {writeup.upvotes}
                                        <i className="fas fa-arrow-down text-red-500 cursor-pointer"></i> {writeup.downvotes}
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

            {selectedWriteup && (
                <Dialog
                    open={isModalOpen}
                    onClose={closeModal}
                    className="fixed inset-0 z-10 overflow-y-auto"
                >
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        <div className="relative bg-neutral-800 text-white w-full  rounded max-w-3xl mx-auto p-6">
                         
                         

                    
                               <h1 className='text-2xl'>{selectedWriteup.title}</h1>
                            <p>
                                Authored by <span onClick={() => window.location.href = `../../users/${user.username}`} className='text-blue-500 cursor-pointer'>{user.username}</span> for challenge <span onClick={() => window.location.href = `../../challenges/${selectedWriteup.challengeId}`} className='text-yellow-500 cursor-pointer'>{selectedWriteup.title}</span>.
                            </p>
                            <div className="mt-2">
                                <p>{selectedWriteup.content}</p>
                            </div>


                          
                            
                 

                            <button className='mt-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-sm' onClick={closeModal}>Close</button>


                       

          
                        </div>

                        
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default Writeups;