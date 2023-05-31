import React from 'react';

const Banner = () => {
    const surveyURL = "https://www.google.com";
    
    return (
        <div className="bg-gradient-to-r from-blue-100 to-purple-200 py-1 flex items-center justify-center">
            <p className="m-0 mr-2 font-semibold">
                Please fill out our survey!{' '}

                <a href={surveyURL} className="hover:text-purple-700 text-blue-700 m1-2">
                    Click here to help!
                </a>
            </p>
        </div>
      );
    };

export default Banner;