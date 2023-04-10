export function PracticeNav() {
  return (
    <>
      <div
        className="w-1/7 mt-10 flex-none text-neutral-900"
        style={{ borderColor: '#212121' }}
      >
        <ul className="mr-2 py-2">
          <li className="mb-4 py-1">
            <a
              href="../practice"
              className="px-2 py-2 text-lg font-medium text-white"
            >
              <i class="fas fa-laptop-code mr-2"></i>Hub
            </a>
          </li>
          <li className="mb-4 py-1">
            <a
              href="../practice/community"
              className="px-2 py-2 text-lg font-medium text-white"
            >
              <i class="fas fa-users mr-2"></i>Community
            </a>
          </li>
          <li className="mb-4 py-1">
            <a
              href="../practice/problems"
              className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400"
            >
              <i class="fas fa-folder-open mr-2"></i>Problem Sets
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
