import { HomeModernIcon, CommandLineIcon, SparklesIcon } from '@heroicons/react/20/solid'
import CountUp from "react-countup";
import VisibilitySensor from 'react-visibility-sensor';

export function Stats() {
    const stats = [
        { name: 'Schools Reached', stat: 50, sttype: "Schools", icon: HomeModernIcon },
        { name: 'Challenge Attempts', stat: 10200, sttype: "Attempts", icon: CommandLineIcon },
        { name: 'Total Challenges Solved', stat: 1346, sttype: "Solved", icon: SparklesIcon },
      ]

  return (
    <div className="overflow-hidden  py-24 sm:py-32" style={{backgroundColor:"#212121"}}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">

              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Perfect for Beginners and Pros Alike</p>
              <p className="mt-6 text-lg leading-8 text-white mb-10">At CTFGuide, our community provides a supportive environment for skills development, collaboration, and knowledge sharing. The diversity of perspectives enriches the learning experience and contributes to CTFGuide's growth and success.



</p>              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} style={{backgroundColor: "#161716" }} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className='flex'>
              <dt className="truncate font-medium text-white text-md">{item.name}</dt>
              <item.icon className="ml-2 w-5 text-blue-500" />
            </div>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
              <CountUp className="mt-1 text-3xl font-semibold tracking-tight text-white" end={item.stat} redraw={true} duration={3} separator=",">
                {({ countUpRef, start }) => (
                    <VisibilitySensor onChange={start} delayedCall>
                        <span ref={countUpRef} />
                    </VisibilitySensor>
                )}
              </CountUp>+ {item.sttype}</dd>
          </div>
        ))}
      </dl>
            </div>
            </div>


  )
}
