import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Pricing() {
    return (
        <div>
            <div className=' mt-28 text-3xl' style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>

                <h2 className='text-4xl text-center font-game'>Pricing</h2>
                <h2 className='text-2xl text-center font-game'>Join for Unlimited Access to all Courses</h2>
                <p className='text-xl text-center text-gray-500 mb-4 font-game'>Cancel anytime</p>

                <PricingTable />
            </div>
        </div>
    )
}

export default Pricing