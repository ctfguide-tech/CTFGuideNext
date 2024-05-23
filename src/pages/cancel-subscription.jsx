import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { loadStripe } from '@stripe/stripe-js';
import { Menu } from '@headlessui/react';

const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CancelSubscription() {
    const [selectedCategory, setSelectedCategory] = useState('Tell us here!');
    const [feedback, setFeedback] = useState('');
    const [showCustomOption, setShowCustomOption] = useState(false);

    const handleOptionChange = (event) => {
        const selectedOption = event.target.value;
        if (selectedOption === 'custom') {
            setShowCustomOption(true);
        } else {
            setShowCustomOption(false);
        }
    };

    const handleCustomOptionChange = (event) => {
        setFeedback(event.target.value);
    };

    return (
        <>
            {/* Existing code */}
            <div className='w-1/5'>
                <Menu
                    as="div"
                    className="relative rounded text-left "
                >
                    {/* Existing code */}
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-left divide-y divide-neutral-700 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {/* Existing code */}
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={`${active ? '' : ''
                                        } group  flex items-center bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-900`}
                                    onClick={() =>
                                        setSelectedCategory('Test')
                                    }
                                >
                                    Wasn't using CTFGuide enough/anymore.
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={`${active ? '' : ''
                                        } group  flex items-center bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-900`}
                                    onClick={() =>
                                        setSelectedCategory('Test')
                                    }
                                >
                                    Not Enough Features
                                </a>
                            )}
                        </Menu.Item>
                        {/* New menu item */}
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={`${active ? '' : ''
                                        } group  flex items-center bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-900`}
                                    onClick={() => {
                                        setSelectedCategory('custom');
                                        setShowCustomOption(true);
                                    }}
                                >
                                    Custom
                                </a>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
            {/* Conditionally render the text input box */}
            {showCustomOption && (
                <div>
                    <input
                        type="text"
                        value={feedback}
                        onChange={handleCustomOptionChange}
                    />
                </div>
            )}
        </>
    );
}
