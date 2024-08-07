import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBug, faLock, faUserSecret, faNetworkWired, faBrain, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import request from '@/utils/request';
import router from 'next/router';

const SearchModal = ({ showSearchModal, setShowSearchModal }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const debouncedSearchTerm = useDebounce(search, 100); // We may want to slow this down in prod

  useEffect(() => {
    if (debouncedSearchTerm) {
      const endpoint = process.env.NEXT_PUBLIC_API_URL;
      const url = `${endpoint}/search/${debouncedSearchTerm}`;
      console.log(url);
      request(url, "GET", null).then((res) => { 
        setResults(res.results); 
        console.log(res);
      }).catch((err) => { console.log(err); });
    }
  }, [debouncedSearchTerm]);

  const routeToChallenge = (id) => router.push("/challenges/"+id);
  const routeToUser = (username) => router.push("/users/"+username);

  return (
    <>
      {showSearchModal && (
        <div onEnter={() => setShowSearchModal(true)}>
          <div 
            className="fastanimate fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate__animated animate__faster animate__fadeIn"
            style={{ backdropFilter: 'blur(2px)' }}
            onClick={() => setShowSearchModal(false)}
          >
            <div 
              className="relative transform overflow-hidden rounded-lg bg-neutral-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 sm:max-w-3xl sm:mx-auto sm:rounded-xl sm:shadow-2xl sm:ring-1 sm:ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-5 sm:px-6 mx-auto">
                <div className='flex items-center mx-auto'>
                  <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mr-1 text-white" />
                  <input onChange={e => {
                    setSearch(e.target.value)
                    if(e.target.value === '') setResults(null);
                  }} placeholder="Search for challenges, users, or competitions" className='w-full border-0 text-xl focus:ring-0 bg-transparent text-white' autoFocus />
                </div>

                {
                  results && search && (
                    <div className='mt-5'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                        {results.challenges.map((result, index) => (
                          <div style={{cursor: "pointer"}} key={index} className='p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg' onClick={() => routeToChallenge(result.id)}>
                            <h1 className='text-md text-white font-semibold'><i class="fas fa-tasks fa-fw mr-2"></i>{result.title}</h1>
                          </div>
                        ))}

                        {results.users.map((result, index) => (
                          <div style={{cursor: "pointer"}} key={index} className='p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg' onClick={() => routeToUser(result.username)}>
                            <h1 className='text-md text-white font-semibold'><i class="fas fa-user fa-fw mr-2"></i>{result.username}</h1>
                          </div>
                        ))}

                      </div>
                    </div>
                  )
                }

                <h1 className='mt-10 text-xl text-white font-semibold mb-4 hidden'>Search by Category</h1>
                <div className="flex flex-wrap gap-2 hidden">
                  <button className="px-4 py-2 rounded bg-blue-500 bg-opacity-50 border border-blue-800 hover:brightness-110 text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faBug} className='w-4 h-4' />
                    <span>Web Exploitation</span>
                  </button>
                  <button className="px-4 py-2 rounded bg-green-500 bg-opacity-50 border border-green-800 hover:brightness-110 text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faLock} className='w-4 h-4' />
                    <span>Cryptography</span>
                  </button>
                  <button className="px-4 py-2 rounded bg-red-500 bg-opacity-50 border border-red-800 hover:brightness-110 text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserSecret} className='w-4 h-4' />
                    <span>Reverse Engineering</span>
                  </button>
                  <button className="px-4 py-2 rounded bg-yellow-500 bg-opacity-50 border border-yellow-800 hover:brightness-110 text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faNetworkWired} className='w-4 h-4' />
                    <span>Networking</span>
                  </button>
                  <button className="px-4 py-2 rounded bg-purple-500 bg-opacity-50 border border-purple-800 hover:brightness-110 text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faBrain} className='w-4 h-4' />
                    <span>Forensics</span>
                  </button>
                  <button className="px-4 py-2 rounded bg-pink-500 bg-opacity-50 border border-pink-800 hover:brightness-110 text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faTerminal} className='w-4 h-4' />
                    <span>Binary Exploitation</span>
                  </button>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">{/* Content goes here */}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default SearchModal;

