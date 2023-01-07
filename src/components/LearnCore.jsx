import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'

export function LearnCore() {

    
    return (
        <div className="max-w-6xl mt-12 h-100 mx-auto">
            <h1 className="text-3xl font-bold">Learn</h1>
            <iframe id="terminal" src="https://joshiepoo.com/terminal" style={{width: `100vh`, height: `100vh`}}></iframe>
        </div>
    )

}