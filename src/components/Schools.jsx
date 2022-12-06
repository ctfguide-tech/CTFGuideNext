
import logoGV from '@/images/logos/garnetvalley.jpg'
import logoDCTS from '@/images/logos/dcts.jpeg'
import logoPSU from '@/images/logos/psu.jpg'
import logoNSU from '@/images/logos/northeastern.png'
import Image from 'next/image'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Schools() {
  return (

<div className="mx-auto text-center mt-10 mb-10">
<p className="font-display text-base text-slate-900">
  Trusted by schools around the world
</p>
<ul
  role="list"
  className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
>
  {[
    [
      { name: 'Garnet Valley School District', logo: logoGV, width: 200, height: 200 },
      { name: 'Delaware County Technical Schools', logo: logoDCTS, width: 150, height: 200 },
      { name: 'Penn State', logo: logoPSU, width: 50, height: 200 },
      { name: 'Northeastern University', logo: logoNSU, width: 200, height: 200 },


    ]
  ].map((group, groupIndex) => (
    <li key={groupIndex}>
      <ul
        role="list"
        className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
      >
        {group.map((company) => (
          <li key={company.name} className="flex">
            <Image className='filter grayscale' width={company.width} src={company.logo} alt={company.name} unoptimized />
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>
</div>

)
        }