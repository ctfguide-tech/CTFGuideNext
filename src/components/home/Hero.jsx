import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeInSection } from '../functions/styling/FadeInSection'

export function Hero() {


  return (
    
    <Container style={{fontFamily: 'Poppins, sans-serif'}}  className="bg-blend-darken  mx-auto max-w mt-20">
 <FadeInSection>
    <div className='flex flex-wrap items-center text-center lg:text-left -mx-2 my-auto mx-auto'>
 <div className="lg:w-2/3 px-2 lg:pr-10 mt-10 lg:mt-0 order-1 md:order-1 lg:order-none lg:pl-40">
 <h1 className="font-medium drop-shadow-3xl mx-auto  font-display lg:text-5xl text-3xl tracking-tight text-white text-wrap ">
 An ethical hacking, learning, and competition platform for students and professionals alike.

      </h1>

      <button className='mt-8 px-6 py-2 mt-4 text-xl bg-blue-600 text-white font-semibold rounded-sm'>Start hacking</button>
      <button className='mt-8 px-6 py-2 mt-4 text-md  text-white font-semibold rounded-sm'>Not your first time here?</button>

  </div>

  <div className='mx-auto text-center lg:w-1/3  my-auto lg:pr-40 sm:pr-0 md:pr-0 '>
      <img src="./testfux.png" className="floating mx-auto text-center  w-full" ></img>
  </div>
    </div>
    </FadeInSection>
    </Container>

    
  )
}
