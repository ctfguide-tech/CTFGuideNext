import { useRef, useEffect, useState } from 'react';
import CountUp from 'react-countup';

export function CountUpScroll({ item }) {
  const [isInView, setIsInView] = useState(false);
  const countUpRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (countUpRef.current) {
      observer.observe(countUpRef.current);
    }

    return () => {
      if (countUpRef.current) {
        observer.unobserve(countUpRef.current);
      }
    };
  }, [countUpRef]);

  return (
    <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
      {isInView ? (
        <CountUp
          className="mt-1 text-3xl font-semibold tracking-tight text-white"
          start={0}
          end={item.stat}
          duration={3}
          separator=","
          ref={countUpRef}
        />
      ) : (
        '0'
      )}
      + {item.sttype}
    </dd>
  );
}
