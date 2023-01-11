import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

export function Hero() {
  return (
    <Container style={{fontFamily: 'Poppins, sans-serif'}}  className="bg-blend-darken  pt-20 pb-32 text-center lg:pt-32">
      <h1 className="font-medium drop-shadow-3xl mx-auto max-w-4xl font-display text-5xl  tracking-tight text-white sm:text-7xl">
        Cybersecurity{' '}
        <span className="relative whitespace-nowrap text-white">
    
          <span className="relative ">made easy</span>
        </span>{' '}
        for everyone.
      </h1>
      <p className="mx-auto mt-6  max-w-xl text-2xl font-display  text-white py-1 px-2 rounded-lg">
        The one stop platform for cybersecurity.
      </p>
  
    </Container>

    
  )
}
