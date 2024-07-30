import React from 'react';
import { Tooltip } from 'react-tooltip';
import CusTooltip from './BadgeOnhover';

const Badge = ({
  active,
  createdAt,
  badgeName,
  badgeImage,
  badgeDescription,
  badgeReason,
}) => {
  return (
    <CusTooltip
      name={badgeName}
      description={badgeDescription}
      icon={<img src={badgeImage} />}
      reason={badgeReason}
      date={createdAt}
    >
      <div
        className="bg-neutral-800 py-4 text-center transition ease-in-out hover:bg-neutral-700/40"
        data-tooltip-id="badge-tooltip"
        data-tooltip-place="top"
      >
        <Tooltip id="badge-tooltip" />
        <img src={badgeImage} width="100" className="mx-auto" />
      </div>
    </CusTooltip>
  );
};

export default Badge;
