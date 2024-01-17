const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

const ClassroomNav = ({ classCode }) => {
  return (
    <div className="flex">
      <div className="hidden md:ml-6 md:flex ">
        {/* Current: "border-blue-500 text-white", Default: "border-transparent text-gray-300 hover:font-bold" */}
        <button
          onClick={() => {
            window.location.href = `${baseUrl}/groups/${classCode}/home`;
          }}
          className="ml-2 inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200 "
        >
          Home
        </button>
        <button
          onClick={() => {
            window.location.href = `${baseUrl}/groups/${classCode}/view-all-assignments`;
          }}
          className="inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
        >
          Assignments
        </button>
        <button
          onClick={() =>
            (window.location.href = `${baseUrl}/groups/${classCode}/gradebook`)
          }
          className=" inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
        >
          Gradebook
        </button>
        <button
          onClick={() =>
            (window.location.href = `${baseUrl}/groups/${classCode}/settings`)
          }
          className=" inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default ClassroomNav;
