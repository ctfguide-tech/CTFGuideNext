import { useRouter } from 'next/router';
const StudentNav = ({ classCode }) => {
  const router = useRouter();
  return (
    <div className="bg-neutral-800">
      <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-10 justify-between">
          <div className="flex items-center">
            <button
              onClick={() => {
                router.push(`/groups/${classCode}/home`);
              }}
              className="ml-2 inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200 "
            >
              Home
            </button>
            <button
              onClick={() => {
                router.push(`/groups/${classCode}/student-gradebook`);
              }}
              className="ml-2 inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200 "
            >
              Grades
            </button>
            <button
              onClick={() => {
                router.push(`/groups/${classCode}/view-all-assignments`);
              }}
              className="ml-2 inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200 "
            >
              Assignments
            </button>
            <button
              onClick={() => {
                router.push(`/groups/${classCode}/settings`);
              }}
              className="ml-2 inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200 "
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentNav;
