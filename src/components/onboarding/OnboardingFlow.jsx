
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
import { useState, useEffect } from 'react'


export function OnboardingFlow() {
    const [flowState, setFlowState] = useState('none');
    
    useEffect(() => {

        
    });


    if (flowState === '1') {
        return <RoleAsk />
    } else if (flowState === '2') {
        return <ExpAsk />
    } else if (flowState === '3') {
        return <ProjectAsk />
    } else if (flowState === '4') {
        return <ProjectAsk />
    } else {
        return (
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
    }
}
