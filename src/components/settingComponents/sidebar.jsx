import Link from 'next/link';

export default function Sidebar(){
  
    return(
         <div
              className="  mt-10 flex-none border-r pl-10 pr-10 text-gray-900"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 py-2">
                <li className="py-1">
                  <Link
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                    
                  >
                    {' '}
                    General
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </Link>
                </li>
              </ul>
            </div>
    );
}