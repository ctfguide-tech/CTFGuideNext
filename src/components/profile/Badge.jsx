import React from 'react';
import { Tooltip } from 'react-tooltip';
import CusTooltip from './BadgeOnhover';

const Badge =  ({ active, createdAt, badgeName, badgeImage, badgeDescription, badgeReason }) => {
    
    
    return (
    <CusTooltip name={badgeName} description={badgeDescription} icon={<img src={badgeImage}/>} reason={badgeReason} date={createdAt}>
    <div
    className="border border-neutral-700 border-2 bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-700/40"
    data-tooltip-id="badge-tooltip"
    data-tooltip-place="top"
    >
    <Tooltip id="badge-tooltip" />
    <img
      src={badgeImage}
      width="100"
      className="mx-auto mt-2 px-1"
    />

  </div>
  </CusTooltip>
)};

export default Badge;