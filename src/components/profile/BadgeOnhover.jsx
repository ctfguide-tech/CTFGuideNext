import React, { useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#262626',
    color: 'white',
    fontSize: 15,
    borderRadius: '1rem',
    opacity: 0.1,
    padding: '0rem',
    width: '220px',
    height: '320px',
    overflow: 'hidden',
    fontFamily: 'Poppins',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#262626',
  },
});

export default function CusTooltip({
  children,
  name,
  description,
  icon,
  reason,
  date,
}) {
  const [onHover, setOnHover] = useState(false);

  return (
    <CustomTooltip
      className="opacity-95"
      title={
        <div className="flex flex-col items-center">
          {icon && <div className="mt-8 w-24">{icon}</div>}
          <div className="mt-4 text-lg font-semibold">{name}</div>
          <div
            className="absolute bottom-20 flex flex-col items-center"
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
          >
            {' '}
            <div
              className={`font-semibold text-blue-600 transition-opacity duration-200 ${
                onHover ? 'opacity-0' : 'opacity-85'
              }`}
            >
              {description}
            </div>
            <div
              className={`absolute text-amber-400 transition-opacity duration-200 ${
                onHover ? 'opacity-85' : 'opacity-0'
              }`}
            >
              {reason}
            </div>
          </div>
          <div className="absolute bottom-2 w-full rounded-b-lg bg-blue-600 py-1 text-xs">
            Earned on{' '}
            {new Date(date).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
          </div>
        </div>
      }
      arrow
      placement="top"
    >
      <span>{children}</span>
    </CustomTooltip>
  );
}
