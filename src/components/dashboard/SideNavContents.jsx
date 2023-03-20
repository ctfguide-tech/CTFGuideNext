export function SideNavContent() {
    return (
        <>
          <div className="w-1/6 text-gray-900 flex-none mt-10 border-r mr-6" style={{ borderColor: "#212121" }}>
            <ul className="py-2 mr-2">
              <li className="mb-4 py-1"><a href="../dashboard" className="px-2 py-2 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-chart-line mr-2"></i>Overview</a></li>
              <li className="mb-4 py-1 "><a href="../dashboard/likes" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-heart mr-2"></i>Likes</a></li>
              <li className="mb-4 py-1"><a href="../dashboard/badges" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-certificate mr-2"></i>Badges</a></li>
              <li className="mb-4 py-1 hidden"><a href="../dashboard/my-challenges" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-book mr-2"></i>Your Challenges</a></li>
              {/*<li className="mb-4 py-1"><a href="../dashboard/my-friends" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-user-friends mr-2"></i>Friends</a></li>*/}
            </ul>
            
            <hr className='mx-auto border border-[#323232]'></hr>
            <a href="/guides/about">
              <div class="max-w-sm mt-6 mr-4 rounded-lg shadow">
                <i class="w-10 h-10 mb-2 text-green-500 dark:text-green-500 text-3xl fas fa-seedling"></i>
                <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">New to CTFGuide?</h5>
                <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">See how you can make the most of your cybersecurity journey!</p>
                <p class="inline-flex items-center text-blue-600 hover:underline">
                    Show me more
                    <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                </p>
              </div>
            </a>
          </div>
        </>
    )
}
