import React from 'react';

export function LogoAdmin(props) {
    return (
        <div className="mx-auto my-auto flex rainbow-logo">
            <img className="mx-auto w-12 text-center" src="../../../../darkLogo" alt="Logo" />
            <h1
                className="my-auto text-xl font-semibold text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
            >
                CTFGuide <span className="text-orange-600">Developer</span>
            </h1>
        </div>
    );
}
  