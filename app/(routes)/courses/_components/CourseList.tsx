"use client"

import axios from 'axios'
import { ChartNoAxesColumnIncreasingIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export type Course = {
    id: number,
    courseId: number,
    title: string,
    desc: string,
    bannerImage: string,
    level: string,
    tags: string,
    chapters?: Chapter[],
    userEnrolled?: boolean,
    courseEnrolledInfo?: CourseEnrolledInfo[],
    completedExercises?: CompletedExercises[]
}

export type CompletedExercises = {
    chapterId: number,
    exerciseId: number,
    courseId: number,
}

export type CourseEnrolledInfo = {
    xpEarned: number,
    enrolledDate: any,
}

export type Chapter = {
    chapterId: number,
    courseId: number,
    desc: string,
    name: string,
    id: number,
    exercises: Exercise[]
}

export type Exercise = {
    name: string,
    slug: string,
    xp: number,
    difficulty: string,
}

function CourseList() {

    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GetAllCourses();
    }, []);

    const GetAllCourses = async () => {
        setLoading(true);
        const result = await axios.get('/api/course');
        console.log("All Courses: ", result.data);
        setCourseList(result.data.result);
        setLoading(false);
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-3'>
            {
                !loading && courseList?.map((course, index) => (
                    <Link key={index} href={'/courses/' + course?.courseId}>
                        <div className='border-4 rounded-xl hover:bg-zinc-900 cursor-pointer'>
                            <Image src={(course?.bannerImage).trimEnd()}
                                alt={course?.title}
                                width={400}
                                height={400}
                                className='w-full h-[200px] object-cover rounded-t-lg'
                            />
                            <div className='p-4'>
                                <h2 className='font-game text-2xl'>{course?.title}</h2>
                                <p className='font-game text-xl text-gray-500 line-clamp-2'>{course.desc}</p>
                                <h2 className='bg-zinc-800 flex gap-2 font-game p-1 mt-3 px-4 rounded-2xl items-center inline-flex'>
                                    <ChartNoAxesColumnIncreasingIcon className='h-4 w-4' />
                                    {course?.level}
                                </h2>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default CourseList