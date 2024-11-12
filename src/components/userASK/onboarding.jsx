import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

const OnboardingModal = ({ showModal, setShowModal }) => {
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <CSSTransition
      in={showModal}
      timeout={300}
      classNames="slide"
      unmountOnExit
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="relative w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
          <div className="flex justify-end p-2">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
            <p className="mt-4 text-gray-600">
              We would like to understand where you stand. Please provide us with some information.
            </p>
            {/* Add your form or content here */}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

const Onboarding = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div>
      <OnboardingModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Onboarding;
