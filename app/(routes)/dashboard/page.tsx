import EnrolledCourses from '@/app/(routes)/dashboard/_components/EnrolledCourses'
import ExploreMore from '@/app/(routes)/dashboard/_components/ExploreMore'
import InviteFriend from '@/app/(routes)/dashboard/_components/InviteFriend'
import UpgradeToPro from '@/app/(routes)/dashboard/_components/UpgradeToPro'
import UserStatus from '@/app/(routes)/dashboard/_components/UserStatus'
import WelcomeBanner from '@/app/(routes)/dashboard/_components/WelcomeBanner'
import React from 'react'
import ExploreMoreCourses from './_components/ExploreMoreCourses'

function Dashboard() {
    return (
        <div className='p-10 md:px-20 lg:px-36 xl:px-48'>
            <div className='grid grid-cols-3 gap-7'>
                <div className='col-span-2'>
                    <WelcomeBanner />
                    <EnrolledCourses />
                    <ExploreMoreCourses />
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