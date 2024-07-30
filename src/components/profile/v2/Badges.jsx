import React, { useEffect, useState } from 'react';
import request from '@/utils/request';
import { Tooltip } from 'react-tooltip';
import Badge from '@/components/profile/Badge.jsx';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CusTooltip from '../BadgeOnhover';
const Badges = ({ user }) => {
  const router = useRouter();
  const [badges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const badgesPerPage = 25;

  useEffect(() => {
    const fetchUserBadges = async () => {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/userBadges`,
        'GET',
        null
      );
      setUserBadges(response.badges);
      setLoading(false);
    };
    setLoading(true);
    fetchUserBadges();
  }, [user]);

  if (loading)
    return (
      <div className="text-neutral-400">
        <Skeleton width="100%" baseColor="#363535" highlightColor="#615f5f" />
      </div>
    );

  console.log('USER BADGES:', badges);

  const totalPages = Math.ceil(badges.length / badgesPerPage);
  const startIndex = (currentPage - 1) * badgesPerPage;
  const endIndex = startIndex + badgesPerPage;
  const currentBadges = badges.slice(startIndex, endIndex);

  const rowsNeeded = Math.ceil(currentBadges.length / 5);

  return (
    <>
      <div
        className="grid grid-cols-5 bg-neutral-800"
        style={{ gridTemplateRows: `repeat(${rowsNeeded}, minmax(0, 1fr))` }}
      >
        {currentBadges && currentBadges.length > 0 ? (
          currentBadges.map((badge) => (
            <Badge
              key={badge.id}
              active={badge.badge.active}
              badgeName={badge.badge.badgeName}
              badgeImage={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/badges/group2.png`}
              badgeDescription={badge.badge.badgeDescription}
              badgeReason={badge.badge.badgeReason}
              createdAt={badge.createdAt}
            />
          ))
        ) : (
          <div
            className="col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40"
            data-tooltip-content="Complete challenges to earn badges!"
            data-tooltip-id="badge-tooltip"
            data-tooltip-place="top"
          >
            {user && <Tooltip id="badge-tooltip" />}
            <img
              src={'/CuteKana.png'}
              width="100"
              className="mx-auto mt-2 px-1"
            />
            <h1 className="mx-auto mt-2 text-center text-xl text-white">
              No Badges Yet...
            </h1>
          </div>
        )}
      </div>
      {badges.length > 0 && (
        <div className="mx-auto mt-8 text-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg bg-neutral-600 p-2 text-white"
          >
            Previous
          </button>
          <span className="m-4 text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-lg bg-neutral-600 px-6 py-2 text-white"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Badges;
