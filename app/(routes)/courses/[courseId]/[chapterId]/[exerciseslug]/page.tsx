'use client'

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { Exercise } from '../../../_components/CourseList';
import ContentSection from './_components/ContentSection';


export type CourseExercise = {
    chapterId: number,
    courseId: number,
    desc: string,
    name: string,
    exercises: Exercise[],
    exerciseData: ExerciseData
}

export type ExerciseData = {
    chapterId: number,
    courseId: number,
    exerciseId: string,
    exerciseName: string,
    exercisesContent: ExerciseContent,
}

export type ExerciseContent = {
    content: string,
    hint: string,
    hintXp: string,
    starterCode: any,
    task: string,
}


function Playground() {

    const { courseId, chapterId, exerciseslug } = useParams();
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
        const result = await axios.post('/api/exercise', {
            courseId: courseId,
            chapterId: chapterId,
            exerciseId: exerciseslug
        })
        setLoading(false);

        console.log(result.data);
        setCourseExerciseData(result.data);
    }

    return (
        <div className='h-[calc(100vh-80px)] border-t-4'>
            <Group orientation="horizontal">
                <Panel defaultSize={40} minSize={20}>
                    <div className='h-full p-4'>
                        <ContentSection courseExerciseData={courseExerciseData} loading={loading} />
                    </div>
                </Panel> 
                <Separator className='w-1.5 bg-zinc-700 hover:bg-blue-500 transition-colors' />
                <Panel defaultSize={60} minSize={30}>
                    <div className='h-full p-4'>
                        Code Editor
                    </div>
                </Panel>
            </Group>
        </div>
    )
}

export default Playground

