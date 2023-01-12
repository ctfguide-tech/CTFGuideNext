import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeInSection } from '../functions/styling/FadeInSection'

export function Hero() {
  return (
    
    <Container style={{fontFamily: 'Poppins, sans-serif'}}  className="bg-blend-darken h-screen pt-20 pb-20  lg:pt-32 px-10 ">
 <FadeInSection>
    <div className='grid grid-cols-2'>
 <div className="pl-40 mx-auto mt-6 w-full">
 <h1 className="font-medium drop-shadow-3xl mx-auto  font-display text-5xl  tracking-tight text-white sm:text-7xl ">
        Cybersecurity{' '}
        <span className="relative whitespace-nowrap text-white">
    
          <span className="relative ">made <span className='text-green-500'>easy</span></span>
        </span>{' '}
        for everyone.
      </h1>
      <p className="mx-auto mt-6  text-left  text-3xl font-display  text-white py-1 px-2 rounded-lg">
        The <span className='text-blue-500'>one stop</span> platform for cybersecurity.
      </p>
  </div>

  <div className='mx-auto'>
      <img src="./header.png" className="floating mt-6" width="400"></img>
  </div>
    </div>
    </FadeInSection>
    </Container>

    
  )
}
