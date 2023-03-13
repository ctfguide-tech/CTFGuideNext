import { useState,useEffect } from "react"
import Challenge from "../challenge/ChallengeComponent";

export function Community({challenges}) {
    const [difficulty, setDifficulty] = useState('All');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState("");

    const search = (event) => {
        setFilter(event.target.value);
    }


    return (
        <>
            <div className="flex max-w-6xl mt-10">
            <div className="w-2/3 max-w-xs flex-row-reverse">
                    <label htmlFor="difficulty" className="block text-sm leading-5 font-medium text-gray-200">Difficulty</label>
                    <select style={{ backgroundColor: "#212121" }} id="difficulty" className="mt-1 border-none text-white rounded  block w-full pr-40 pl-3 pr-10 py-2 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5" onChange={(e) => {setDifficulty(e.target.value);}}> 
                        <option value="all">All</option>
                        <option value='easy'>Easy</option>
                        <option value='medium'>Medium</option>
                        <option value='hard'>Hard</option>
                    </select>
                </div>
                        <div className="ml-10 w-full">
                            <label htmlFor="difficulty" className="block text-sm leading-5 font-medium text-gray-200">Search</label>
                            <input id="search" style={{ backgroundColor: "#212121" }} onChange={search} placeholder="Search for a Challenge" className="mt-1  rounded text-gray-200 block w-full pr-40 pl-3 pr-10 py-2 text-base leading-6  focus:outline-none sm:text-sm sm:leading-5"></input>
                        </div>
                    </div>


                    <div className='max-w-6xl text-left mt-6'>
                        {/* <div className="grid grid-cols-4 gap-4 gap-y-6 mt-4">
                            <div id="starter" className='hidden card rounded-lg px-4 py-2 w-full border-l-4 border-green-500' style={{ backgroundColor: "#212121" }}>
                                <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
                                <p className='text-white'>Decrypt my breakfast please</p>
                                <div className='flex mt-2'>

                                    <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
                                    <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
                                </div>
                            </div>
                        </div> */}
                        <h1 className='text-white text-3xl font-semibold'> 🔥 Popular </h1>
                        <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 gap-y-6 mt-4">
                            
                        {
                            challenges
                                .filter(challenge => {
                                    if(difficulty.toLowerCase() === "all") {
                                        return true;
                                    }
                                    if(difficulty !== "" && challenge.difficulty !== difficulty.toLowerCase()) {
                                        return false;
                                    }
                                    if(challenge.category.includes(filter)) {
                                        return true;
                                    }
                                    if(
                                        filter !== "" && 
                                        !(challenge.title.includes(filter) || challenge.problem.includes(filter))
                                    ) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((challenge, index) => (
                                    <Challenge data={challenge} key={index}/>
                                ))
                        }
                        </div>
                    </div>
                    <hr className='max-w-4xl mt-10 border-slate-800'></hr>
            <div className='max-w-6xl text-left mt-6'>
                <h1 className='text-white text-3xl font-semibold'> 📦  Recently Created </h1>
                <div className="grid grid-cols-4 gap-4 gap-y-6 mt-4"></div>
            </div>
        </>
    )
}