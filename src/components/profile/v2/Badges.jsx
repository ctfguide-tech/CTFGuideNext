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
  
  useEffect(() => {
    const fetchUserBadges = async () => {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/userBadges`, 'GET', null );
      setUserBadges(response.badges);
      setLoading(false);
    }
    setLoading(true);
    fetchUserBadges();
  }, [user]);
  if (loading) return <div className='text-neutral-400'><Skeleton width="100%" baseColor="#363535" highlightColor="#615f5f"  /></div>;
  console.log("USER BADGES:", badges);
  

  /*
  Badge object returned:
  badge: 
    active: true
    badgeBonus: 0
    badgeDescription: "Extinguish those flames!"
    badgeImage: ""
    badgeName: "First HARD Challenge"
    badgeReason: "Submit your first hard challenge"
    id: 9
  */
    /*
      "success": true,
      "badges": [
          {
              "id": 1,
              "createdAt": "2024-07-28T21:11:30.671Z",
              "userId": "4eb33ad3-e477-4088-a726-d76dae33b01c",
              "badgeId": 9,
              "badge": {
                  "id": 9,
                  "badgeName": "First HARD Challenge",
                  "badgeDescription": "Extinguish those flames!",
                  "badgeReason": "Submit your first hard challenge",
                  "badgeImage": "",
                  "badgeBonus": 0,
                  "active": true
              }
          },
          {
              "id": 2,
              "createdAt": "2024-07-28T21:11:30.704Z",
              "userId": "4eb33ad3-e477-4088-a726-d76dae33b01c",
              "badgeId": 2,
              "badge": {
                  "id": 2,
                  "badgeName": "First Challenge",
                  "badgeDescription": "A first of many",
                  "badgeReason": "Complete your first challenge",
                  "badgeImage": "",
                  "badgeBonus": 0,
                  "active": true
              }
          },
      */

  return (
  <div className="grid grid-cols-5 gap-x-2 gap-y-2 rounded-sm bg-neutral-800 mt-4">
          {badges && badges.length > 0 ? (
            
            badges.map((badge) => (
             
              <Badge
                key={badge.id}
                active={badge.badge.active}
                badgeName={badge.badge.badgeName}
                badgeImage={"../badges/group2.png"}
                badgeDescription={badge.badge.badgeDescription}
                badgeReason={badge.badge.badgeReason}
                createdAt={badge.createdAt}
              />
            ))
          ) : (
            <div className="align-center duration-4000 col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40" data-tooltip-content="Complete challenges to earn badges!" data-tooltip-id="badge-tooltip" data-tooltip-place="top">
              {user && <Tooltip id="badge-tooltip" />}
              <img src={'/CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
              <h1 className="mx-auto mt-2 text-center text-xl text-white">No Badges Yet...</h1>
            </div>
          )}
    
    </div>
  );
};

export default Badges;