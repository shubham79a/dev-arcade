"use client"

import { useUser } from '@clerk/nextjs'
import Image from 'next/image'


function WelcomeBanner() {
    const { user } = useUser();
    return (
        <div className='flex gap-3 items-center'>
            <Image src={'/machine.png'} alt='robo' width={120} height={120} />
            <h2 className='text-2xl font-game p-3 border bg-zinc-800 rounded-lg rounded-bl-none'>
                Welcome Back, <span className='text-yellow-500'>{user?.firstName}</span>, Start Learning Something new...</h2>
        </div>
    )
}

export default WelcomeBanner