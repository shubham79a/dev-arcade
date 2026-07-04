import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Hero() {
    return (
        <div className='w-full relative h-screen overflow-hidden'>
            <Image src={'/hero.gif'} alt='' width={1000} height={1000}
                priority
                className='w-full h-full object-cover absolute inset-0'
            />

            <div className='absolute w-full flex flex-col items-center mt-24'>
                <h2 className='font-bold max-sm:text-4xl text-5xl lg:text-8xl font-game'>
                    Start Your
                </h2>
                <h2 className='font-bold max-sm:text-4xl text-5xl lg:text-8xl font-game text-yellow-400'
                    style={{
                        textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                    }}
                >
                    Coding Adventure
                </h2>
                <h2 className='mt-5 font-game max-sm:text-center max-sm:text-xl text-3xl lg:text-4xl'>
                    Beginner friendly coding courses and projects.
                </h2>
                <Link href={'/sign-in'}>
                    <Button className='font-game text-3xl p-6 mt-7 cursor-pointer' variant={'pixel'}>Get Started</Button>
                </Link>

            </div>

        </div>
    )
}

export default Hero