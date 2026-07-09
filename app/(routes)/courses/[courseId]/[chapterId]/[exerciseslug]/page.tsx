'use client'

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { CompletedExercises, Exercise } from '../../../_components/CourseList';
import ContentSection from './_components/ContentSection';
import CodeEditor from './_components/CodeEditor';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';


export type CourseExercise = {
    id: number,
    courseId: number,
    desc: string,
    name: string,
    editorType: string,
    exercises: Exercise[],
    exerciseData: ExerciseData,
    completedExercise: CompletedExercises[]
}

export type ExerciseData = {
    id: number,
    courseId: number,
    chapterId: number,
    slug: string,
    name: string,
    xp: number,
    difficulty: string,
    hintXpPenalty: number,
    content: string,
    task: string,
    hint: string,
    starterCode: any,
    validationRegex: string,
    expectedOutput: string,
}


function Playground() {

    const { courseId, chapterId, exerciseslug } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [courseExerciseData, setCourseExerciseData] = useState<CourseExercise>();



    // console.log(
    //     courseId, chapterId, exerciseslug
    // )


    useEffect(() => {
        GetExerciseCourseDetail();
    }, [])

    const GetExerciseCourseDetail = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/exercise', {
                courseId: courseId,
                chapterId: chapterId,
                exerciseId: exerciseslug
            })
            setLoading(false);

            console.log(result.data);
            setCourseExerciseData(result.data);
        } catch (error: any) {
            setLoading(false);
            if (error?.response?.status === 403) {
                toast.error('Please enroll in the course first!');
                router.push('/courses/' + courseId);
            }
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        }
    }, [])

    return (
        <div className='h-[calc(100vh-80px)] border-t-4'>
            <Group orientation="horizontal">
                <Panel defaultSize={40} minSize={20}>
                    <div className=''>
                        <ContentSection courseExerciseData={courseExerciseData} loading={loading} />
                    </div>
                </Panel>
                <Separator className='w-1.5 bg-zinc-700 hover:bg-blue-500 transition-colors' />
                <Panel defaultSize={60} minSize={30}>
                    <div className=''>
                        <CodeEditor courseExerciseData={courseExerciseData} loading={loading} />
                    </div>
                </Panel>
            </Group>

            <div className='font-game fixed bottom-0 w-full bg-zinc-900 flex p-4 justify-between items-center'>
                <Button variant={'pixel'} className='text-xl'>Prvious</Button>
                <div className='flex gap-3 items-center'>
                    <Image src='/star.png' alt='xp-star' width={40} height={40} />
                    <h2 className='text-2xl '>You can earn <span className='text-green-400 text-4xl'>{courseExerciseData?.exerciseData?.xp}</span> Xp</h2>
                </div>
                <Button variant={'pixel'} className='text-xl'>Next</Button>
            </div>

        </div>
    )
}

export default Playground
