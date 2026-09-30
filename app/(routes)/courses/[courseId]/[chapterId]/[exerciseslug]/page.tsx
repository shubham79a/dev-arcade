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
    const [hintRevealed, setHintRevealed] = useState(false);

    useEffect(() => {
        setHintRevealed(false);
        GetExerciseCourseDetail();
    }, [courseId, chapterId, exerciseslug])

    const GetExerciseCourseDetail = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/exercise', {
                courseId: courseId,
                chapterId: chapterId,
                exerciseId: exerciseslug
            })
            setCourseExerciseData(result.data);
        } catch (error: any) {
            if (error?.response?.status === 403) {
                toast.error('Please enroll in the course first!');
                router.push('/courses/' + courseId);
            } else if (error?.response?.status === 404) {
                toast.error('Exercise not found');
                router.push('/courses/' + courseId);
            } else {
                toast.error('Could not load the exercise');
            }
        } finally {
            setLoading(false);
        }
    }

    const onExerciseCompleted = (records: CompletedExercises[]) => {
        setCourseExerciseData(prev => prev && ({
            ...prev,
            completedExercise: [...(prev.completedExercise ?? []), ...records]
        }));
    }

    // Previous / Next within the current chapter (API returns exercises sorted by orderIndex)
    const exercises = courseExerciseData?.exercises ?? [];
    const currentIndex = exercises.findIndex(item => item.slug === exerciseslug);
    const prevExercise = currentIndex > 0 ? exercises[currentIndex - 1] : undefined;
    const nextExercise = currentIndex >= 0 ? exercises[currentIndex + 1] : undefined;

    const goToExercise = (slug: string) => {
        router.push(`/courses/${courseId}/${chapterId}/${slug}`);
    }

    const exerciseData = courseExerciseData?.exerciseData;
    const earnableXp = hintRevealed
        ? Math.max(0, (exerciseData?.xp ?? 0) - (exerciseData?.hintXpPenalty ?? 0))
        : exerciseData?.xp;

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
                    <div className='h-full overflow-hidden'>
                        <ContentSection courseExerciseData={courseExerciseData} loading={loading}
                            hintRevealed={hintRevealed} onRevealHint={() => setHintRevealed(true)} />
                    </div>
                </Panel>
                <Separator className='w-1.5 bg-zinc-700 hover:bg-blue-500 transition-colors' />
                <Panel defaultSize={60} minSize={30}>
                    <div className='h-full overflow-hidden'>
                        <CodeEditor courseExerciseData={courseExerciseData} loading={loading}
                            usedHint={hintRevealed} onCompleted={onExerciseCompleted} />
                    </div>
                </Panel>
            </Group>

            <div className='font-game fixed bottom-0 w-full bg-zinc-900 flex p-4 justify-between items-center'>
                <Button variant={'pixel'} className='text-xl'
                    disabled={!prevExercise}
                    onClick={() => prevExercise && goToExercise(prevExercise.slug)}
                >Previous</Button>
                <div className='flex gap-3 items-center'>
                    <Image src='/star.png' alt='xp-star' width={40} height={40} />
                    <h2 className='text-2xl '>You can earn <span className='text-green-400 text-4xl'>{earnableXp}</span> Xp</h2>
                </div>
                <Button variant={'pixel'} className='text-xl'
                    disabled={!nextExercise}
                    onClick={() => nextExercise && goToExercise(nextExercise.slug)}
                >Next</Button>
            </div>

        </div>
    )
}

export default Playground
