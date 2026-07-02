import React from 'react'
import CourseList from '../(routes)/courses/_components/CourseList'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function PopularCourses() {
    return (
        <div>
            <div className='font-game flex flex-col items-center justify-center'>
                <h2 className='text-2xl md:text-3xl lg:text-5xl mt-10'>Popular Course to Explore</h2>
                <h2 className='text-md md:text-2xl lg:text-3xl text-center'>Learn Coding with interactive courses, Practical handson with real life experiences!</h2>
            </div>
            <div className='mt-8 px-4 md:px-20 lg:px-28 mb-16'>
                <CourseList maxLimit={8} />
                <Link href={'/courses'} className='flex items-center justify-center'>
                    <Button variant={'pixel'} size={'lg'} className=' mt-8 cursor-pointer'>
                        Explore More Courses
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default PopularCourses