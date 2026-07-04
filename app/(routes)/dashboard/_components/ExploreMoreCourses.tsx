import React from 'react'
import CourseList from '../../courses/_components/CourseList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function ExploreMoreCourses() {
    return (
        <div className='my-8'>
            <div className='mt-7 flex justify-between items-center gap-2'>
                <h2 className='font-game max-sm:text-2xl text-3xl mb-2'>
                    Explore Other Courses
                </h2>
                <Link href={'/courses'}>
                    <Button className='font-game text-lg cursor-pointer' variant={'pixel'}>
                        View All
                    </Button>
                </Link>
            </div>
            <CourseList smallerCard={true} maxLimit={6} />
        </div>
    )
}

export default ExploreMoreCourses