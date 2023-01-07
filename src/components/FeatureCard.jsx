import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'

export function FeatureCard() {
  return (
    <>
<Container style={{backgroundColor:"#161716"}} className="py-10">
    <div style={{backgroundColor:"#161716"}} className='max-w-6xl mx-auto grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 mt-10'>
      <div style={{fontFamily: 'Poppins, sans-serif'}} className="bg-gradient-to-r from-indigo-900 to-blue-900 py-10">
             <img src="./terminal.png" className='w-20 mx-auto'></img>
            <h1 style={{fontFamily: 'Poppins, sans-serif'}} className='text-white text-5xl mx-auto text-center my-auto font-semibold'>Sandbox</h1>
            <h2 className='text-white mx-auto text-center'>A multiplayer terminal in the cloud.</h2>
      </div>
      <div className="my-auto mx-auto px-4  text-center">
            <h1 className='text-white text-xl'> Connect to our Linux terminals right from your browser. Work together with friends on the same terminal with just a few clicks</h1>
      </div>
      </div>

      <div style={{backgroundColor:"#161716"}} className='max-w-6xl mx-auto grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1  mt-10'>
      <div style={{fontFamily: 'Poppins, sans-serif'}} className="bg-gradient-to-r from-indigo-900 to-blue-900 py-10">
             <img src="./practice.png" className='w-20 mx-auto'></img>
            <h1 style={{fontFamily: 'Poppins, sans-serif'}} className='text-white text-5xl mx-auto text-center my-auto font-semibold'>Practice</h1>
            <h2 className='text-white mx-auto text-center'>Engaging competitive CTF problems.</h2>
      </div>

      <div className="my-auto mx-auto px-6  text-center">
            <h1 className='text-white text-xl'> Brush up on your competitive cybersecurity skills with hundreds of community uploaded problems. All challenge problems have detailed writeups. </h1>
      </div>

      </div>

      <div style={{backgroundColor:"#161716"}} className='max-w-6xl mx-auto grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1  mt-10'>
      <div style={{fontFamily: 'Poppins, sans-serif'}} className="bg-gradient-to-r from-indigo-900 to-blue-900 py-10">
             <img src="./book.png" className='w-20 mx-auto'></img>
            <h1 style={{fontFamily: 'Poppins, sans-serif'}} className='text-white text-5xl mx-auto text-center my-auto font-semibold'>Learn</h1>
            <h2 className='text-white mx-auto text-center'>Free interactive cybersecurity lessons.</h2>
      </div>

      <div className="my-auto mx-auto px-6  text-center">
            <h1 className='text-white text-xl'> Learn new cybersecurity concepts in an interactive fashion. We use machine learning to create more dynamic learning experiences. </h1>
      </div>

      </div>
      </Container>
    </>
  )
}
