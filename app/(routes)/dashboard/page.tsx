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
        <div className='p-4 md:px-20 lg:px-36 xl:px-48'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
                {/* Welcome Banner - always first */}
                <div className='md:col-span-2'>
                    <WelcomeBanner />
                </div>

                {/* Sidebar - appears after banner on mobile, right column on desktop */}
                <div className='md:col-span-1 md:row-span-2'>
                    <UserStatus />
                    <UpgradeToPro />
                </div>

                {/* Rest of main content */}
                <div className='md:col-span-2'>
                    <EnrolledCourses />
                    <ExploreMoreCourses />
                    <ExploreMore />
                    <InviteFriend />
                </div>
            </div>


        </div>
    )
}

export default Dashboard