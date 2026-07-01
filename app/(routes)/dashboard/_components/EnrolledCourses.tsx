"use client"

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import CourseProgressCard from './CourseProgressCard';

export type EnrolledCourseInfo = {
    bannerImage: string,
    courseId: number,
    completedExercises: number,
    level: string,
    title: string,
    totalExercises: number,
    xpEarned: number
}

function EnrolledCourses() {
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const GetUserEnrolledCourses = async () => {
        setLoading(true);
        const result = await axios.get('/api/course?courseid=enrolled');
        console.log(result.data);
        setEnrolledCourses(result.data);
        setLoading(false);
    }

    useEffect(() => {
        GetUserEnrolledCourses();
    }, [])

    return (
        <div className='mt-8'>
            <h2 className='font-game text-3xl mb-2'>
                Your Enrolled Courses
            </h2>
            {
                loading && <Skeleton className='w-full rounded-2xl my-5' />
            }
            {
                enrolledCourses?.length == 0 ?
                    <div className='flex flex-col items-center gap-3 p-7 border rounded-2xl bg-zinc-900 '>
                        <Image src={'/book.png'} alt='book'
                            width={90} height={90} />
                        <h2 className='font-game text-xl'>
                            You don't have any enrolled courses
                        </h2>
                        <Link href={'/courses'}>
                            <Button variant={'pixel'} size={'lg'} className='cursor-pointer font-game mt-2 text-lg'>
                                Browse All Courses
                            </Button>
                        </Link>
                    </div>
                    :
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5'>
                        {
                            enrolledCourses?.map((course, index) => (
                                <div key={index}>
                                    <CourseProgressCard course={course} />
                                </div>
                            ))
                        }

                    </div>
            }
        </div>
    )
}

export default EnrolledCourses