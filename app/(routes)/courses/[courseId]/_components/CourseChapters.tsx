import React from 'react'
import { Course } from '../../_components/CourseList'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

type Props = {
  loading: boolean,
  courseDetail: Course | undefined
}

function CourseChapters({ loading, courseDetail }: Props) {


  const { has } = useAuth();
  const hasPremiumAccess = has({ plan: 'unlimited' });

  const isExerciseCompleted = (exerciseDbId: number) => {
    const completedChapters = courseDetail?.completedExercises;
    return completedChapters?.some(item => item.exerciseId === exerciseDbId) ?? false;
  }


  return (
    <div>
      {
        courseDetail?.chapters?.length == 0 ?

          <div>
            <Skeleton className='w-full h-[100px] roundex-xl' />
            <Skeleton className='w-full h-[100px] roundex-xl mt-5' />
            <Skeleton className='w-full h-[100px] roundex-xl mt-5' />
          </div>
          :
          <div className='max-sm:p-2 md:p-4 p-5 border-4 rounded-2xl '>
            {
              courseDetail?.chapters?.map((chapter, index) => (
                <Accordion type="single" collapsible key={index}>
                  <AccordionItem value='item-1'>
                    <AccordionTrigger className='md:p-3 hover:bg-zinc-800 font-game text-4xl'>
                      <div className='flex items-center justify-between w-full'>

                        <div className='flex max-md:gap-7 max-sm:gap-4 gap-10'>
                          <h2 className='max-sm:w-8 max-sm:h-8 max-sm:text-xl w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center'>
                            {index + 1}.
                          </h2>
                          <h2 className='max-sm:text-xl text-3xl lg:text-4xl'>{chapter?.name} </h2>
                        </div>
                        {
                          !hasPremiumAccess
                          && index >= 2 &&
                          <h2 className='font-game text-3xl text-yellow-400'>Pro</h2>
                        }
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='max-sm:px-2 max-sm:py-3 sm:p-4 md:p-7 bg-zinc-900 rounded-2xl '>
                        {
                          chapter.exercises.map((exercise, indexExc) => (
                            <div key={indexExc} className='flex items-center justify-between mb-7' >
                              <div className='flex items-center justify-between max-md:gap-7 max-sm:gap-3 gap-10 font-game'>
                                <h2 className='max-sm:text-lg text-2xl lg:text-3xl'><span className='max-sm:hidden'>Exercise</span> {(index * chapter?.exercises.length) + indexExc + 1}</h2>
                                <h2 className='max-sm:text-lg text-2xl lg:text-3xl'>{exercise.name}</h2>
                              </div>

                              {
                                isExerciseCompleted(exercise.id)
                                  ?
                                  <Link href={'/courses/' + courseDetail.id + '/' + chapter.id + '/' + exercise.slug}>
                                    <Button variant={'pixel'} className='bg-green-600'>Completed</Button>
                                  </Link>
                                  :
                                  (courseDetail?.userEnrolled && (!hasPremiumAccess) && index < 2)
                                    ?
                                    <Link href={'/courses/' + courseDetail.id + '/' + chapter.id + '/' + exercise.slug}>
                                      <Button variant={'pixel'}>{exercise.xp} xp</Button>
                                    </Link>
                                    :
                                    (!hasPremiumAccess && courseDetail?.userEnrolled && index >= 2) ?
                                      <Link href={`/pricing?redirect=/courses/${courseDetail.id}`}>
                                        <Button
                                          className='cursor-pointer '
                                          variant={'link'}
                                        >Buy Pro</Button>
                                      </Link>
                                      :
                                      (hasPremiumAccess && courseDetail.userEnrolled) ?
                                        <Link href={'/courses/' + courseDetail.id + '/' + chapter.id + '/' + exercise.slug}>
                                          <Button variant={'pixel'}>{exercise.xp} xp</Button>
                                        </Link>
                                        :
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant={'pixelDisabled'}>???</Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Please Enroll first</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                              }

                            </div>
                          ))
                        }
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            }
          </div>
      }

    </div>
  )
}

export default CourseChapters