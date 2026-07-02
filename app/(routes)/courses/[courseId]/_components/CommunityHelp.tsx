import { Button } from '@/components/ui/button'
import React from 'react'

function CommunityHelp() {
    return (
        <div className='font-game p-4 border-4 rounded-2xl mt-7 flex items-center flex-col gap-4'>
            <h2 className='text-3xl'>Need help?</h2>
            <p className='text-2xl text-center'>Ask question in our community</p>
            <Button className='text-2xl mt-3' size={'lg'} variant={'pixel'}>Community</Button>
        </div>
    )
}

export default CommunityHelp