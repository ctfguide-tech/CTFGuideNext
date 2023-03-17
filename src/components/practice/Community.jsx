import { useState,useEffect } from "react"
import Challenge from "../challenge/ChallengeComponent";

export function Community({challenges}) {
    const [difficulty, setDifficulty] = useState('all');
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
                        <h1 className='text-white text-3xl font-semibold'> 🔥 Popular </h1>
                        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-4 gap-y-6 mt-4">
                        {
                            challenges
                                .filter(challenge => {
                                    if(difficulty.toLowerCase() != "all" && challenge.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
                                        return false;
                                    }
                                    if(filter !== "" && challenge.category.includes(filter.toLowerCase())) {
                                        return true;
                                    }
                                    if(
                                        filter !== "" && 
                                        !(challenge.title.toLowerCase().includes(filter.toLowerCase()) || challenge.content.toLowerCase().includes(filter.toLowerCase()))
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
             
        </>
    )
}