import EnrolledCourses from '@/app/_components/EnrolledCourses'
import ExploreMore from '@/app/_components/ExploreMore'
import InviteFriend from '@/app/_components/InviteFriend'
import UpgradeToPro from '@/app/_components/UpgradeToPro'
import UserStatus from '@/app/_components/UserStatus'
import WelcomeBanner from '@/app/_components/WelcomeBanner'
import React from 'react'

function Dashboard() {
    return (
        <div className='p-10 md:px-20 lg:px-36 xl:px-48'>
            <div className='grid grid-cols-3 gap-7'>
                <div className='col-span-2'>
                    <WelcomeBanner />
                    <EnrolledCourses />
                    <ExploreMore />
                    <InviteFriend />
                </div>
                <div className='col-span-1'>
                    <UserStatus />
                    <UpgradeToPro />
                </div>
            </div>


        </div>
    )
}

export default Dashboard