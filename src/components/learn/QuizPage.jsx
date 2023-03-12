import { useState } from 'react';
import { Quiz } from './Quiz';
import { SectionsNav } from './SectionsNav';

function QuizPage({ totalQuizPages, sublesson }) { // receive totalQuizPages as a prop
  const [page, setPage] = useState(1);

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrev = () => {
    setPage(page - 1);
  };

  const pagePercentage = parseInt(100/totalQuizPages)

  return (
    <div className="flex-1 text-white">
      <h1 className='mt-10 text-3xl font-semibold'>Mastery Task</h1>
      <hr className='mb-5 mt-2'></hr>
      <SectionsNav currentPage={page} cpv={new Array(totalQuizPages).fill(pagePercentage)} colors={new Array(totalQuizPages).fill("gray")} sublesson={sublesson}/>
      <div className="flex" style={{ overflowX: "scroll" }}>
        {[...Array(totalQuizPages)].map((_, index) => (
          page === index + 1 && <Quiz page={page} sublesson={sublesson}/>
        ))}
      </div>
      <div className="flex justify-between mt-5">
        {page > 1 && (
          <button onClick={handlePrev} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Back
          </button>
        )}
        {page < totalQuizPages && (
          <button onClick={handleNext} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Next
          </button>
        )}
        {page === totalQuizPages && (
          <a href="./dynamic1">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to next task
            </button>
          </a>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
