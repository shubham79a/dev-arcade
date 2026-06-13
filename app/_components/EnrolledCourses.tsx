"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function EnrolledCourses() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    useEffect(() => {

    }, [])

    return (
        <div className='mt-8'>
            <h2 className='font-game text-3xl mb-2'>
                Your Enrolled Courses
            </h2>
            {
                enrolledCourses?.length == 0 ?
                    <div className='flex flex-col items-center gap-3 p-7 border rounded-2xl bg-zinc-900 '>
                        <Image src={'/book.png'} alt='book'
                            width={90} height={90} />
                        <h2 className='font-game text-xl'>
                            You don't have any enrolled courses
                        </h2>
                        <Button variant={'pixel'} size={'lg'} className='cursor-pointer font-game mt-2 text-lg'>
                            Browse All Courses
                        </Button>
                    </div>
                    :
                    <div>List</div>
            }
        </div>
    )
}

export default EnrolledCourses