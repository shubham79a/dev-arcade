import React from 'react'
import CourseList from '../../courses/_components/CourseList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function ExploreMoreCourses() {
    return (
        <div className='my-8'>
            <div className='mt-7 flex justify-between items-center'>
                <h2 className='font-game text-3xl mb-2'>
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