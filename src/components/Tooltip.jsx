import { useState } from 'react';

export default function Tooltip({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children[0]}
      {isVisible && children[1]}
    </div>
  );
} 