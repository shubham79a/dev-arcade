"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseDetailBanner from './_components/CourseDetailBanner';
import CourseChapters from './_components/CourseChapters';
import axios from 'axios';
import { Course } from '../_components/CourseList';
import CourseStatus from './_components/CourseStatus';
import UpgradeToPro from '@/app/_components/UpgradeToPro';
import CommunityHelp from './_components/CommunityHelp';


type CourseDetail = {
}

function CourseDetail() {
    const { courseId } = useParams();
    const [courseDetail, setCourseDetail] = useState<Course>();
    const [loading, setLoading] = useState(false);

    console.log("course detail", courseDetail)

    useEffect(() => {
        console.log("course detail", courseDetail)

        courseId && GetCourseDetail();
    }, [courseId])

    const GetCourseDetail = async () => {
        setLoading(true);
        const result = await axios.get('/api/course?courseid=' + courseId);
        setCourseDetail(result?.data);
        console.log(result);
        setLoading(false);
    }

    return (
        <div>
            <CourseDetailBanner
                courseDetail={courseDetail}
                loading={loading}
                refreshData={() => GetCourseDetail()}
            />
            <div className='grid grid-cols-3 p-10 md:px-24 lg:px-36 gap-7'>
                <div className='col-span-2'>
                    <CourseChapters courseDetail={courseDetail} loading={loading} />
                </div>
                <div className='col-span-1'>
                    <CourseStatus courseDetail={courseDetail} />
                    <UpgradeToPro />
                    <CommunityHelp />
                </div>
            </div>
        </div>
    )
}

export default CourseDetail