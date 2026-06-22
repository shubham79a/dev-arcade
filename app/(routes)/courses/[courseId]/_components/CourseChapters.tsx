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

type Props = {
  loading: boolean,
  courseDetail: Course | undefined
}

function CourseChapters({ loading, courseDetail }: Props) {


  const EnableExercise = (
    chapterIndex: number,
    exerciseIndex: number,
    chapterExercisesLength: number
  ) => {
    const completed = courseDetail?.completedExercises;

    // If nothing is completed, enable FIRST exercise ONLY
    if (!completed || completed.length === 0) {
      return chapterIndex === 0 && exerciseIndex === 0;
    }

    // last completed
    const last = completed[completed.length - 1];

    // Convert to global exercise number
    const currentExerciseNumber =
      chapterIndex * chapterExercisesLength + exerciseIndex + 1;

    const lastCompletedNumber =
      (last.chapterId - 1) * chapterExercisesLength + last.exerciseId;

    return currentExerciseNumber === lastCompletedNumber + 2;
  };



  const isExerciseCompleted = (chapterId: Number, experciseId: Number) => {
    const completedChapters = courseDetail?.completedExercises;

    const comepletedchapter = completedChapters?.find((item => (item.chapterId == chapterId && item.exerciseId, experciseId)));

    return comepletedchapter ? true : false
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
          <div className='p-5 border-4 rounded-2xl '>
            {
              courseDetail?.chapters?.map((chapter, index) => (
                <Accordion type="single" collapsible key={index}>
                  <AccordionItem value='item-1'>
                    <AccordionTrigger className='p-3 hover:bg-zinc-800 font-game text-4xl'>
                      <div className='flex gap-10'>
                        <h2 className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center'>
                          {index + 1}.
                        </h2>
                        <h2>{chapter?.name} </h2>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='p-7 bg-zinc-900 rounded-2xl '>
                        {
                          chapter.exercises.map((exercise, indexExc) => (
                            <div key={indexExc} className='flex items-center justify-between mb-7' >
                              <div className='flex items-center gap-10 font-game'>
                                <h2 className='text-3xl'>Exercise {(index * chapter?.exercises.length) + indexExc + 1}</h2>
                                <h2 className='text-3xl'>{exercise.name}</h2>
                              </div>

                              {
                                EnableExercise(index, indexExc, chapter?.exercises.length)
                                  ?
                                  <Link href={'/courses/' + courseDetail.courseId + '/' + exercise.slug}>
                                    <Button variant={'pixel'}>{exercise.xp} xp</Button>
                                  </Link>
                                  :
                                  isExerciseCompleted(chapter.chapterId, indexExc + 1)
                                    ?
                                    <Button variant={'pixel'} className='bg-green-600'>Completed</Button>
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