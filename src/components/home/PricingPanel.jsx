import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { FadeInSection } from '../functions/styling/FadeInSection'
export function PricingPanel() {
    return (
        <>
                <Container style={{ backgroundColor: "#161716" }} className="mt-40">

<div>
<FadeInSection>
                        <h1 className='mt-24 text-white text-5xl font-semibold text-center '>Pricing</h1>
                        </FadeInSection>
                        <div className="grid grid-cols-3 gap-5 max-w mx-auto mt-16">
                        <FadeInSection>
                              <div>
                                    <div style={{ backgroundColor: "#212121" }} className='bg-black py-4 border-l-8 border-blue-900'>
                                          <img src="./free.png" width="80" className='mx-auto text-center'></img>

                                          <h1 className='mt-4 text-white text-center text-3xl'>Free</h1>
                                          <h3 className='mx-auto text-white text-center text-4xl font-semibold'>$0<span className='text-2xl'>/month</span></h3>

                                          <ul className='mx-auto text-white text-center'>
                                                <li>✓ 1 hour daily limit on terminals</li>
                                                <li>✓ Access to 50% of learning content</li>
                                                <li>✓ Access to practice problems</li>
                                                <li>✓ Create classrooms</li>
                                                <li>✓ Community Support</li>

                  <br></br>
                                          <a className='text-blue-500 text-center mx-auto border px-2 py-1 mt-4 text-xl  border-blue-500   ' href="mailto:sales@ctfguide.com">Get Started</a>

                                          </ul>
                                    </div>
                              </div>
</FadeInSection><FadeInSection>
                              <div>
                                    <div style={{ backgroundColor: "#212121" }} className='bg-black py-4 border-l-8 border-blue-900 mx-auto text-center'>
                                          <img src="./fame.png" width="80" className='mx-auto text-center'></img>
                                          <h1 className='mt-4 text-white text-center text-3xl'>Pro</h1>
                                          <h3 className='mx-auto text-white text-center text-4xl font-semibold'>$5<span className='text-2xl'>/month</span></h3>
                                          <ul className='mx-auto text-white text-center'>
                                                <li>✓ No daily limit on terminals</li>
                                                <li>✓ Host private competitions</li>
                                                <li>✓ Pro Badge that is visible to everyone</li>
                                                <li>✓ Access to all learning content</li>
                                                <li>✓ Priority terminal access</li>

                                          </ul>

                                          <br></br>


                                          <a className='text-blue-500 text-center mx-auto border px-2 py-1 mt-4 text-xl  border-blue-500 ' href="mailto:sales@ctfguide.com">Buy Now</a>

                                    </div>
                              </div>
</FadeInSection>
<FadeInSection>
                              <div>
                                    <div style={{ backgroundColor: "#212121" }} className='bg-black py-4 border-l-8 border-blue-900 mx-auto text-center'>
                                          <img src="./organization.png" width="80" className='mx-auto text-center'></img>
                                          <h1 className='mt-4 text-white text-center text-3xl'>Organizations</h1>
                                          <h3 className='mx-auto text-white text-center text-4xl font-semibold'>$200-$500<span className='text-2xl'>/month</span></h3>
                                          <ul className='mx-auto text-white text-center'>
                                          <li>✓ Pro for all members</li>
                                          <li>✓ SSO Support</li>
                                          <li>✓ Custom domain support</li>
                                          <li>✓ Employee training modules</li>
                                          <li>✓ Custom branding</li>
                                          <br></br>
                                          <a className='text-blue-500 text-center mx-auto border px-2 py-1 mt-4 text-xl  border-blue-500 ' href="mailto:sales@ctfguide.com">Contact Sales</a>

                                          </ul>


                                    </div>


                              </div>
</FadeInSection>
                        </div>
</div>

</Container>
        </>
    )
}