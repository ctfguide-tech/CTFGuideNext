import { CloudIcon, BookOpenIcon, TrophyIcon } from '@heroicons/react/20/solid'




export function Stats() {
    const stats = [
        { name: 'Schools', stat: '50+ schools' },
        { name: 'Challenge Attempts', stat: '10,2000 attempts' },
        { name: 'Total Challenges Solved', stat: '1,346+ challenges' },
      ]

  return (
    <div className="overflow-hidden  py-24 sm:py-32" style={{backgroundColor:"#212121"}}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">

              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Perfect for Beginners and Pros Alike</p>
              <p className="mt-6 text-lg leading-8 text-white mb-10">At CTFGuide, our community provides a supportive environment for skills development, collaboration, and knowledge sharing. The diversity of perspectives enriches the learning experience and contributes to CTFGuide's growth and success.



</p>              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} style={{backgroundColor: "#161716" }} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate  font-medium text-white text-md">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">{item.stat}</dd>
          </div>
        ))}
      </dl>
            </div>
            </div>


  )
}
