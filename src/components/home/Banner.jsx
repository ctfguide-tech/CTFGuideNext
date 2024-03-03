import React, {useState, useEffect} from 'react';

const Banner = () => {
    const surveyURL = "https://form.jotform.com/231495033815051";
    const [showBanner, setShowBanner] = useState(true);

    const handleCloseBanner = () => {
        setShowBanner(false);
        localStorage.setItem('bannerClosed', 'true');
    };

    useEffect(() => {
        const isBannerClosed = localStorage.getItem('bannerClosed');
        if (isBannerClosed === 'true') {
            setShowBanner(false);
        }
    }, []);

    return (
        <div>
            {showBanner && (
                <div className="hidden bg-neutral-800 py-1 flex items-center justify-between">
                    <p className="m-0 text-white text-center flex-grow">
                        Interested in designing our next feature?{' '}
                        <a href={surveyURL} className="hover:text-purple-700 text-blue-600 m1-2 font-semibold">
                            Click here to let us know!
                        </a>
                    </p>
                    <button
                        id="closeButton"
                        className="text-white hover:text-gray-700 focus:outline-none
                        focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
                        onClick={handleCloseBanner}
                        aria-describedby="tooltip"
                    >
                        x
                    </button>
                </div>
            )}
        </div>
    );
};

export default Banner;