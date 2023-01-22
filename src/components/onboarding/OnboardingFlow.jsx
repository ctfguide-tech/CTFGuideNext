
/*


    2/4 User Experience
  


*/
import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'

// Components to offload and load dynamically
import { RoleAsk } from '@/components/onboarding/RoleAsk'
import { ExpAsk } from '@/components/onboarding/ExpAsk'
import { ProjectAsk } from '@/components/onboarding/ProjectAsk'
import { DataAsk } from '@/components/onboarding/DataAsk'
import { useState, useEffect } from 'react'
import { DataAskPart2 } from '@/components/onboarding/DataAskPart2'
import { Demo } from '@/components/onboarding/Demo'
import { useRouter } from 'next/router'


export function OnboardingFlow() {
    const router = useRouter()
    const part = router.query.part;
    const [flowState, setFlowState] = useState(part);
    
    useEffect(() => {


        
    });

   // Read part from URL query parameter
 

    if (flowState === 1) {
        return <DataAsk />
    } else if (flowState === 2) {
        return <DataAskPart2 />
    } else {
     /*   return (
            <>
    
            <div className='flex justify-center items-center h-screen'>
                <h1 className='text-white text-3xl mr-10'>No flow state selected <p className='text-white text-lg'>Reload to get back to this menu</p></h1>

                
                <select value={{flowState}} onChange={(e => setFlowState(e.target.value))} className='rounded-lg'>
                    <option value="none">Select a flow state</option>
                    <option value="1">Flow 1</option>
                    <option value="2">Flow 2</option>
                    <option value="3">Flow 3</option>
                    <option value="4">Flow 4</option>
                </select>
            </div>
            </>
        )
        */

        return <DataAsk/>
    }
}
