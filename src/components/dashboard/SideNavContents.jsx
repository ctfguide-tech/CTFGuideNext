
import Container from '@/components/Container';


export function SideNavContent() {
    return (
        <>
      <div className="w-1/6  text-gray-900 flex-none mt-10 border-r mr-6" style={{ borderColor: "#212121" }}>
            <ul className="py-2 mr-2">
              <li className="mb-4  py-1"><a href="../dashboard" className="px-2 py-2 text-white  font-medium text-lg"><i class="fas fa-chart-line mr-2"></i> Overview</a></li>
              <li className="mb-4 py-1 "><a href="../dashboard/likes" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-heart mr-2"></i>Likes</a></li>
              <li className="mb-4 py-1"><a href="../dashboard/badges" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-certificate mr-2"></i>Badges</a></li>
              <li className="mb-4 py-1"><a href="../dashboard/my-challenges" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-book mr-2"></i>Your Challenges</a></li>
{/*              <li className="mb-4 py-1"><a href="../dashboard/my-friends" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-user-friends mr-2"></i>Friends</a></li>
 */}

            </ul>
          </div>
        </>
    )
}
