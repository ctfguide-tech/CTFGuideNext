import Link from 'next/link'

export function GroupCard({ title, description, views, imageUrl, href }) {
  return (
      <a href={href} className="block rounded-lg shadow-md overflow-hidden transition-colors duration-300 hover:bg-gray-50">
        <button>
        <div className="relative h-48">
          <img
            className="object-cover w-full h-full"
            src={imageUrl}
            alt=""
          />
          <div className="absolute bottom-0 left-0 p-2 bg-gray-900 bg-opacity-75 text-gray-50">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm">{description}</p>
            <div className="flex items-center mt-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.907 2.007a1 1 0 011.186 0l7.077 4.718a1 1 0 01.44.838v4.718a1 1 0 01-.44.838l-7.077 4.718a1 1 0 01-1.186 0l-7.077-4.718a1 1 0 01-.44-.838V7.563a1 1 0 01.44-.838l7.077-4.718z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M7.82 5.341a1 1 0 01.185-1.497l5.077-2.907a1 1 0 011.186 0l5.077 2.907a1 1 0 01.185 1.497l-2.08 2.644v4.39a1 1 0 01-.44.838l-2.997 1.998a1 1 0 01-1.186 0l-2.997-1.998a1 1 0 01-.44-.838v-4.39l-2.08-2.644z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{views} views</span>
            </div>
          </div>
        </div>
        </button>
      </a>
  )
};
