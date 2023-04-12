import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const CountUpNumber = ({ className, end, duration }) => {
  const [start, setStart] = useState(0);

  useEffect(() => {
    let timer;
    if (start < end) {
      const difference = end - start;
      const increment = Math.ceil(difference / (duration * 60));
      timer = setInterval(() => {
        if (start + increment >= end) {
          setStart(end);
          clearInterval(timer);
        } else {
          setStart(start + increment);
        }
      }, 1000 / 60);
    } else {
      setStart(end);
    }
    return () => clearInterval(timer);
  }, [start, end, duration]);

  return (
    <span className={`text-lg font-medium ${className}`}>
      <CountUp end={start} duration={duration} separator="," />
    </span>
  );
};

export default CountUpNumber;
