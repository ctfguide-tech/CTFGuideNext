import React, { useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip  {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'center',
    backgroundColor: '#111827',
    color: 'white',
    fontSize: 15,
    borderRadius: '1rem', 
    padding: '0.8rem', 
    width: '400px', 
    height: '200px', 
    overflow: 'hidden'
    
    

  }, [`& .${tooltipClasses.arrow}`]: {
    color: '#111827'
  },
});

export default function CusTooltip ({children ,name, description, icon, reason, date}) {
  const [onHover, setOnHover] = useState(false);
  
  return (
    <CustomTooltip title={
        <div className='flex flex-col items-center' > 
            {icon && <div className='mb-2 w-20'>{icon}</div>}
            <div className='flex flex-col items-center'>{name}</div>
            <div className='flex flex-col items-center ' onMouseEnter={()=>setOnHover(true)}
                onMouseLeave={()=>setOnHover(false)}

                > <div className={`transition-opacity duration-200 ${onHover ? 'opacity-0' : 'opacity-100'}`}>
            {description}
          </div>
          <div className={`transition-opacity duration-200 absolute text-yellow-300 ${onHover ? 'opacity-100' : 'opacity-0'}`}>
            {reason}
          </div>
            </div>
            <div className='flex flex-col items-center'>
            {new Date(date).toLocaleDateString('en-US', 
                {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                })}</div>

        </div>
      
    } arrow placement='top'>
      <span>{children}</span>
    </CustomTooltip>
  );
};

