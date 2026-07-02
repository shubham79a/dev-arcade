"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseDetailBanner from './_components/CourseDetailBanner';
import CourseChapters from './_components/CourseChapters';
import axios from 'axios';
import { Course } from '../_components/CourseList';
import CourseStatus from './_components/CourseStatus';
import UpgradeToPro from '@/app/(routes)/dashboard/_components/UpgradeToPro';
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
        <div className=''>
            <CourseDetailBanner
                courseDetail={courseDetail}
                loading={loading}
                refreshData={() => GetCourseDetail()}
            />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-7 mt-4 px-4 md:px-20 lg:px-28 mb-16'>
                <div className='md:col-span-2'>
                    <CourseChapters courseDetail={courseDetail} loading={loading} />
                </div>
                <div className='md:col-span-1'>
                    <CourseStatus courseDetail={courseDetail} />
                    <UpgradeToPro />
                    <CommunityHelp />
                </div>
            </div>
        </div>
    )
}

export default CourseDetail