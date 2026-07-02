import Image from 'next/image'
import React from 'react'
import CourseList from './_components/CourseList'

function Courses() {
    return (
        <div>
            <div className='relative'>
                <Image src={'/course-banner.gif'} alt='course-banner' width={1200} height={300}
                    className='w-full h-[300px] object-cover'
                />
                <div
                    className='absolute top-0 h-full pt-24 px-10 md:px-20 lg:px-32 bg-linear-to-r from-black/80 to-white-50/50'
                >
                    <h2 className='font-game max-sm:text-4xl text-5xl lg:text-8xl '>Explore All Courses</h2>
                    <p className='font-game max-sm:text-xl text-3xl lg:text-4xl'>Explore all courses and get enrolled to learn and increase your skill.</p>
                </div>
            </div>
            <div className='mt-8 px-4 md:px-20 lg:px-28 '>
                <h2 className='font-game text-4xl'>All Courses</h2>
                <CourseList />
            </div>
        </div>
    )
}

export default Courses