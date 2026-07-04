import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'

function InviteFriend() {
    return (
        <div className='flex flex-col items-center mt-8 p-4 border rounded-xl bg-zinc-900'>
            <Image src={'/mail.png'} alt='mail' width={80} height={80} />
            <h2 className='max-sm:text-2xl text-3xl font-game'>
                Invite Friends
            </h2>
            <p className='font-game text-center max-sm:text-sm'>
                Having Fun? Share the love with a friend!
                Enter an email and we will send them personal invite
            </p>
            <div className='flex gap-2 items-center mt-5 max-sm:flex-col max-sm:w-full'>
                <Input placeholder='Enter Invitee Email' className='max-sm:w-full sm:min-w-sm' />
                <Button variant={'pixel'} className='font-game max-sm:w-full'>Invite</Button>
            </div>
        </div>
    )
}

export default InviteFriend