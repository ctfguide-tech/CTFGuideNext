export function PracticeNav() {
  return (
    <>
      <div
        className=" mt-10 flex-none text-neutral-900 w-full   mx-auto rounded-sm shadow-lg"
        style={{ borderColor: '#212121' }}
      >
        <ul className="">
          <li className="mb-1 py-1 px-2 hover:bg-neutral-800/60">
            <a
              href="../practice"
              className="py-2 px-2 text-lg font-medium text-white"
            >
              <i class="fas fa-laptop-code mr-2"></i>Hub
            </a>
          </li>
          <li className="mb-1 py-1 px-2 hover:bg-neutral-800/60 ">
            <a
              href="../practice/community"
              className="px-2 py-2 text-lg font-medium text-white"
            >
              <i class="fas fa-list mr-2"></i>All Challenges
            </a>
          </li>
          <li className="mb-1 py-3 px-2 border border-[#5865F2] bg-neutral-800/50 rounded-lg  mt-12 mx-auto my-auto text-center ">
            <a
              href="../practice/community"
              className="text-lg font-medium text-white tracking-tight "
            >
           Join our Discord community
            </a>
          </li>
          <li className="mb-4 py-1 hidden">
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
