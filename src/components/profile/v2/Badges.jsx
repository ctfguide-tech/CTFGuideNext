import React from 'react';
import { Tooltip } from 'react-tooltip';
import Badge from '@/components/profile/Badge.jsx';

const Badges = ({ badges, ownUser }) => {
  return (
  <div className="grid grid-cols-5 gap-x-2 gap-y-2 rounded-sm bg-neutral-800 mt-4">
          {badges && badges.length > 0 ? (
            badges.map((badge) => (
              <Badge
                key={badge.createdAt}
                createdAt={badge.createdAt}
                badgeName={badge.badge.badgeName}
                badgeTier={badge.badge.badgeTier}
                badgeInfo={badge.badge.badgeInfo}
              />
            ))
          ) : (
            <div className="align-center duration-4000 col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40" data-tooltip-content="Complete challenges to earn badges!" data-tooltip-id="badge-tooltip" data-tooltip-place="top">
              {ownUser && <Tooltip id="badge-tooltip" />}
              <img src={'/CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
              <h1 className="mx-auto mt-2 text-center text-xl text-white">No Badges Yet...</h1>
            </div>
          )}
    
    </div>
  );
};

export default Badges;