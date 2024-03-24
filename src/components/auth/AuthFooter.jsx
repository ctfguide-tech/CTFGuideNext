import Link from 'next/link';

export default function AuthFooter() {
    return (

        <div className='text-neutral-500 text-sm mt-4  items-center justify-center'>
            &copy; CTFGuide Corporation 2024 <br />
            <div className='flex items-center'>
                <Link href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 mr-2">Terms of Service</Link>
                <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 mr-2">Privacy Policy</Link>
                <a href="https://status.ctfguide.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 ">Status</a>
            </div>


        </div>
    )
}

