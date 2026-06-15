import axios from 'axios'
import React from 'react'
import { Course } from '../../_components/CourseList'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

type Props = {
  loading: boolean,
  courseDetail: Course | undefined
}

function CourseDetailBanner({ loading, courseDetail }: Props) {

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
              className='w-full h-[400px] object-cover items-center'
            />
            <div className='font-game absolute top-0 pt-20 p-10 md:px-24 lg:px-36 bg-linear-to-r from-black/80 to-white-50/50 h-full'>
              <h2 className='text-6xl'>
                {courseDetail.title}
              </h2>
              <p className='text-3xl mt-3 text-gray-300'>{courseDetail.desc}</p>
              <Button className='text-2xl mt-7' variant={'pixel'} size={'lg'}>Enroll Now</Button>
            </div>
          </div>
      }
    </div>
  )
}

export default CourseDetailBanner