import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Course } from '../../_components/CourseList'

type Props = {
    courseDetail: Course | undefined;
}

function CourseStatus({ courseDetail }: Props) {

    const [counts, setCounts] = useState<{
        totalExe: number,
        totalXp: number
    }>();

    useEffect(() => {
        courseDetail && GetCounts();
    }, [courseDetail])

    const GetCounts = () => {
        let totalExcercises = 0;
        let totalXp = 0;
        courseDetail?.chapters?.forEach((chapter) => {
            totalExcercises += chapter?.exercises.length
            chapter?.exercises.forEach((exercise) => {
                totalXp += exercise.xp
            })
        })

        setCounts({
            totalExe: totalExcercises,
            totalXp: totalXp
        })
    }

    const updateProgress = (currentValue: number, totalValue: number) => {
        if (totalValue > 0) {
            return Math.round((currentValue / totalValue) * 100);
        }
        return 0;
    }

    return (
        <div className='font-game p-4 border-4 rounded-xl w-full '>
            <h2 className='text-3xl'>Course Progress</h2>
            <div className='flex items-center gap-5 mt-4'>
                <Image src={'/book.png'} alt='book' width={50} height={50} />
                <div className='w-full'>
                    <h2 className='flex justify-between text-2xl w-full'>Exercises <span className='text-gray-400'>{courseDetail?.completedExercises?.length}/{counts?.totalExe}</span></h2>
                    <Progress value={updateProgress(courseDetail?.completedExercises?.length ?? 0, counts?.totalExe ?? 0)} className='mt-2' />
                </div>
            </div>
            <div className='flex items-center gap-5 mt-4'>
                <Image src={'/star.png'} alt='book' width={50} height={50} />
                <div className='w-full'>
                    <h2 className='flex justify-between text-2xl w-full'>XP Earned <span className='text-gray-400'>{courseDetail?.courseEnrolledInfo?.xpEarned ?? 0}/{counts?.totalXp}</span></h2>
                    <Progress value={updateProgress(courseDetail?.courseEnrolledInfo?.xpEarned ?? 0, counts?.totalXp ?? 0)} className='mt-2' />
                </div>
            </div>


        </div>
    )
}

export default CourseStatus