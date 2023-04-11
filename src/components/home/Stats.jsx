import {
  HomeModernIcon,
  CommandLineIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

export function Stats() {
  const stats = [
    {
      name: 'Schools Reached',
      stat: 50,
      sttype: 'Schools',
      icon: HomeModernIcon,
    },
    {
      name: 'Challenge Attempts',
      stat: 10200,
      sttype: 'Attempts',
      icon: CommandLineIcon,
    },
    {
      name: 'Total Challenges Solved',
      stat: 1346,
      sttype: 'Solved',
      icon: SparklesIcon,
    },
  ];

  return (
    <div
      className="overflow-hidden  py-24 sm:py-32"
      style={{ backgroundColor: '#212121' }}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Perfect for Beginners and Pros Alike
        </p>
        <p className="mt-6 mb-10 text-lg leading-8 text-white">
          At CTFGuide, our community provides a supportive environment for
          skills development, collaboration, and knowledge sharing. <br></br>
          <br></br>The diversity of perspectives enriches the learning
          experience and contributes to CTFGuide's growth and success.
        </p>{' '}
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              style={{ backgroundColor: '#161716' }}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <div className="flex">
                <dt className="text-md truncate font-medium text-white">
                  {item.name}
                </dt>
                <item.icon className="ml-2 w-5 text-blue-500" />
              </div>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                <CountUp
                  className="mt-1 text-3xl font-semibold tracking-tight text-white"
                  end={item.stat}
                  redraw={true}
                  duration={3}
                  separator=","
                >
                  {({ countUpRef, start }) => (
                    <VisibilitySensor onChange={start} delayedCall>
                      <span ref={countUpRef} />
                    </VisibilitySensor>
                  )}
                </CountUp>
                + {item.sttype}
              </dd>
            </div>
          ))}
        </dl>
      </div>

    
        <h2 className="text-center mt-10 text-lg font-semibold leading-8 text-white">
          Trusted by the people from these organizations
        </h2>
        <div className="mx-auto mx-auto text-center mt-10 gap-0 grid max-w-6xl   grid-cols-3 items-center gap-y-10 sm:max-w-xl sm:grid-cols-3 -0 lg:max-w-none lg:grid-cols-3">
          <img
            className="col-span-2 w-1/4 object-contain lg:col-span-1 text-center mx-auto"
            src="https://1000logos.net/wp-content/uploads/2017/11/penn-state-logo.png"
            alt="Transistor"
            width={258}
            height={100}
          />
          <img
            className="col-span-2 w-1/5 object-contain lg:col-span-1 text-center mx-auto"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Northeastern_seal.svg/1200px-Northeastern_seal.svg.png"
            alt="Reform"
            width={108}
            height={100}
          />
          <img
            className="col-span-2 w-1/4 object-contain lg:col-span-1 text-center mx-auto"
            src="https://seeklogo.com/images/G/gigamon-logo-47DF4F3B58-seeklogo.com.png"
            alt="Tuple"
            width={228}
            height={100}
          />
      
        </div>
      </div>
 
  );
}
