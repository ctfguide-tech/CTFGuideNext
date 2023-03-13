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
      <div className="carousel__container flex pb-4">
        {data.slice(currentIndex, currentIndex + 4).map((item) => (
            <Challenge data={item} inCarousel={true}/>
        ))}
      </div>
      <div className="mt-1 text-center">
        <button
          className="carousel__button carousel__button--prev transform -translate-y-1/2"
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
        >
          <ArrowLeftCircleIcon className="text-white block h-16 w-16" aria-hidden="true" />
        </button>
        <button
          className="carousel__button carousel__button--next transform -translate-y-1/2"
          onClick={handleNextClick}
          disabled={currentIndex + 4 >= data.length}
        >
          <ArrowRightCircleIcon className="text-white block h-16 w-16" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
