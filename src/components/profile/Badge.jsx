import React from 'react';
import { Tooltip } from 'react-tooltip';

const Badge =  ({ createdAt, badgeName, badgeTier, badgeInfo }) => {
    
    
    return (
    <div
    className="border border-neutral-700 border-2 bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-700/40"
    data-tooltip-content={badgeInfo}
    data-tooltip-id="badge-tooltip"
    data-tooltip-place="top"
    >
    <Tooltip id="badge-tooltip" />
    <img
      src={`../badges/level${badgeTier}/${badgeName.toLowerCase()}.png`}
      width="100"
      className="mx-auto mt-2 px-1"
    />

    <h1 className="mx-auto mt-2 text-center text-xl text-white">
        {badgeName.charAt(0).toUpperCase() + badgeName.slice(1).toLowerCase()}
    </h1>
    <h1 className="text-lg text-white">
      {new Date(createdAt).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })}
    </h1>
  </div>
)};

export default Badge;