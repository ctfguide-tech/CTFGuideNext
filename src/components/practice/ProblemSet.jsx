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
      <div className="carousel__container flex p-4">
        {data.length ? data.map((item) => (
            <Challenge data={item} inCarousel={true}/>
        )) : ""}
        {
        !data.length && <p className="text-center text-white w-full mb-4">No data available for this category</p>
        }
      </div>
      <div className="mt-4 text-center">
        <button
          className="carousel__button carousel__button--prev  transform -translate-y-1/2 cursor-pointer"
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
        >
          <ArrowLeftCircleIcon className="text-neutral-500 hover:text-neutral-300 block h-10 w-10" aria-hidden="true" />
        </button>
        <button
          className="carousel__button carousel__button--next transform -translate-y-1/2 cursor-pointer"
          onClick={handleNextClick}
          disabled={currentIndex + 4 >= data.length}
        >
          <ArrowRightCircleIcon className="text-neutral-500  hover:text-neutral-300  block h-10 w-10" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
