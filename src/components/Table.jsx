
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import Link from "next/link"

export function MyTable() {
  return (
    (<div
      className="overflow-x-auto  bg-neutral-800/50  shadow-sm  text-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Competition</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-3">
                <img src="https://pbs.twimg.com/profile_images/2189766987/ctftime-logo-avatar_400x400.png" className="h-6 w-6"></img>
             
                <span className="font-medium">DefCon CTF</span>
              </div>
            </TableCell>
            <TableCell>August 11-13, 2024</TableCell>
            <TableCell>Las Vegas, NV</TableCell>
            <TableCell>
              <Link className="text-white hover:underline " href="#">
                View Website
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-3">
                <img src="https://pbs.twimg.com/profile_images/2189766987/ctftime-logo-avatar_400x400.png" className="h-6 w-6"></img>
                <span className="font-medium">UCSB iCTF</span>
              </div>
            </TableCell>
            <TableCell>October 6-8, 2024</TableCell>
            <TableCell>Santa Barbara, CA</TableCell>
            <TableCell>
              <Link className="text-white hover:underline " href="#">
                View Website
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-3">
                <img src="https://pbs.twimg.com/profile_images/2189766987/ctftime-logo-avatar_400x400.png" className="h-6 w-6"></img>
                <span className="font-medium">CSAW CTF</span>
              </div>
            </TableCell>
            <TableCell>November 10-12, 2024</TableCell>
            <TableCell>New York, NY</TableCell>
            <TableCell>
              <Link className="text-white hover:underline " href="#">
                View Website
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-3">
                <img src="https://pbs.twimg.com/profile_images/2189766987/ctftime-logo-avatar_400x400.png" className="h-6 w-6"></img>
                <span className="font-medium">CTFGuide Fest 2024</span>
              </div>
            </TableCell>
            <TableCell>Year-round</TableCell>
            <TableCell>Online</TableCell>
            <TableCell>
              <Link className="text-white hover:underline " href="#">
                View Website
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-3">
                <img src="https://pbs.twimg.com/profile_images/2189766987/ctftime-logo-avatar_400x400.png" className="h-6 w-6"></img>
                <span className="font-medium">SANS Holiday Hack Challenge</span>
              </div>
            </TableCell>
            <TableCell>December 1-31, 2024</TableCell>
            <TableCell>Online</TableCell>
            <TableCell>
              <Link className="text-white hover:underline " href="#">
                View Website
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>)
  );
}

function TrophyIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>)
  );
}
