import axios from 'axios'
import React, { useState } from 'react'
import { Course } from '../../_components/CourseList'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  loading: boolean,
  courseDetail: Course | undefined,
  refreshData(): void
}

function CourseDetailBanner({ loading, courseDetail, refreshData }: Props) {

  const [enrollLoading, setEnrollLoading] = useState(false);

  const EnrollCourse = async () => {
    setEnrollLoading(true);
    const result = await axios.post('/api/enroll-course', {
      courseId: courseDetail?.courseId
    });
    // console.log(result);
    toast.success('Course Enrolled');
    refreshData();
    setEnrollLoading(false);
  }

  return (
    <div>
      {
        !courseDetail ?
          <Skeleton className='w-full h-[300px] rounded-2xl' />
          :
          <div className='relative'>
            <Image
              src={courseDetail?.bannerImage} alt={courseDetail?.title}
              height={400} width={1400}
              className='w-full h-[350px] max-sm:h-[300px] object-cover items-center'
            />
            <div className='font-game absolute top-0 pt-20 p-10 md:px-24 lg:px-36 bg-linear-to-r from-black/80 to-white-50/50 h-full'>
              <h2 className='max-sm:text-3xl text-5xl lg:text-7xl'>
                {courseDetail.title}
              </h2>
              <p className='max-sm:text-xl text-3xl lg:text-4xl mt-3 text-gray-300'>{courseDetail.desc}</p>
              {
                !courseDetail?.userEnrolled ?
                  <Button className='text-2xl mt-7' variant={'pixel'} size={'lg'}
                    onClick={EnrollCourse} disabled={enrollLoading}
                  >  {enrollLoading && <Loader2Icon className='animate-spin' />}
                    Enroll Now</Button>
                  :
                  <Button variant={'pixel'} className='text-2xl mt-7' size={'lg'}>Continue Learning...</Button>
              }
            </div>
          </div>
      }
    </div>
  )
}

export default CourseDetailBanner