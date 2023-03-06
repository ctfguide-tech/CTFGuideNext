export function PracticeNav() {
    return (
        <>
            <div className="w-1/7 text-gray-900 flex-none mt-10 border-r" style={{ borderColor: "#212121" }}>
                <ul className="py-2 mr-2">
                <li className="mb-4 py-1"><a href="../practice" className="px-2 py-2 text-white font-medium text-lg"><i class="fas fa-laptop-code mr-2"></i>Hub</a></li>
                <li className="mb-4 py-1"><a href="../practice/community" className="px-2 py-2 text-white font-medium text-lg"><i class="fas fa-users mr-2"></i>Community</a></li>
                <li className="mb-4 py-1"><a href="../practice/problems" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-folder-open mr-2"></i>Problem Sets</a></li>
                <li className="mb-4 py-1 "><a href="../practice/getting-started" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-question mr-2"></i>Getting Started</a></li>
                <li className="mb-4 py-1"><a href="../practice/explore" className="px-2 py-1 text-white hover:text-gray-400 font-medium text-lg"><i class="fas fa-map mr-2"></i>Explore</a></li>
            </ul>
          </div>
        </>
    )
}