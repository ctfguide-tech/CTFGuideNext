import React, { useState } from "react";
import Challenge from "@/components/challenge/ChallengeComponent";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline'

const Carousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleNextClick = () => {
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="carousel">
      <div className="carousel__container flex overflow-x-scroll pb-4">
        {data.slice(currentIndex, currentIndex + 4).map((item) => (
          <div key={item._id} className="carousel__card w-64 h-40 rounded-md shadow-md mx-2">
            <Challenge data={item} />
          </div>
        ))}
      </div>
      <button
        className="carousel__button carousel__button--prev top-1/2 left-2 transform -translate-y-1/2"
        onClick={handlePrevClick}
        disabled={currentIndex === 0}
      >
        <ArrowLeftCircleIcon className="text-white block h-16 w-16" aria-hidden="true" />
      </button>
      <button
        className="carousel__button carousel__button--next top-1/2 right-2 transform -translate-y-1/2"
        onClick={handleNextClick}
        disabled={currentIndex + 4 >= data.length}
      >
        <ArrowRightCircleIcon className="text-white block h-16 w-16" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Carousel;
