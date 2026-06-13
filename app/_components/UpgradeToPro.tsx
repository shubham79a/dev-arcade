import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'


function UpgradeToPro() {
    return (
        <div className='flex items-center flex-col p-5 border-4 rounded-2xl mt-8'>
            <Image src={'/logo.png'} alt='logo' width={70} height={70} />
            <h2 className='text-3xl font-game'>Upgrade to Pro</h2>
            <p className='font-game text-gray-500 text-xl text-center'>
                Join Pro Membership and get All course access
            </p>
            <Link href={'/pricing'}>
                <Button className='font-game w-full' variant={'pixel'} size={'lg'} >
                    Upgrade
                </Button>
            </Link>
        </div>

    )
}

export default UpgradeToPro