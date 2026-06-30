import React from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    useSandpack,
} from "@codesandbox/sandpack-react";
import { Panel, Group, Separator } from 'react-resizable-panels';
import { CourseExercise } from '../page';
import { Button } from '@/components/ui/button';
import { nightOwl } from "@codesandbox/sandpack-themes"
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

type Props = {
    courseExerciseData?: CourseExercise | undefined
    loading: boolean
}

const CodeEditorChildren = ({ onCompleteExercise, IsCompleted }: any) => {

    const { sandpack } = useSandpack();


    return (
        <div className='flex font-game gap-5 absolute bottom-40 right-5'>
            <Button variant={'pixel'} size={'lg'} className='text-xl'
                onClick={() => sandpack.runSandpack()}
            >
                Run Code
            </Button> 
            <Button variant={'pixel'} className='bg-[#a3e534] text-xl' size={'lg'}
                onClick={() => onCompleteExercise()}
                disabled={IsCompleted}
            >
                {IsCompleted ? 'Already Completd' : "Mark Completed"}
            </Button>
        </div>
    )
}



function CodeEditor({ courseExerciseData, loading }: Props) {

    const { exerciseslug } = useParams();

    const exerciseIndex = courseExerciseData?.exercises.findIndex(item => item.slug === exerciseslug);

    const IsCompleted = courseExerciseData?.completedExercise.find((item) => item.exerciseId === (exerciseIndex !== undefined ? exerciseIndex + 1 : -1));

    const onCompleteExercise = async () => {
        if (IsCompleted) {
            toast.error('Exercise already completed');
            return;
        }

        console.log(exerciseIndex);

        if (exerciseIndex == undefined) return;

        try {
            const result = await axios.post('/api/exercise/complete', {
                courseId: courseExerciseData?.courseId,
                chapterId: courseExerciseData?.chapterId,
                exerciseId: exerciseIndex + 1,
                xpEarned: courseExerciseData?.exercises[exerciseIndex].xp
            })

            console.log(result);
            toast.success('Exercise completed successfully');
        } catch (error: any) {
            if (error?.response?.status === 403) {
                toast.error('Please enroll in the course first!');
            } else if (error?.response?.status === 409) {
                toast.error('Exercise already completed!');
            } else {
                toast.error('Something went wrong');
            }
        }
    }

    return (
        <div>
            <SandpackProvider template="static"
                style={{
                    height: '100vh'
                }}
                files={
                    courseExerciseData?.exerciseData?.exercisesContent?.starterCode
                }
                options={
                    {
                        autorun: false,
                        autoReload: false
                    }
                }
                theme={nightOwl}
            >
                <SandpackLayout
                    style={{
                        height: '100%'
                    }}
                >
                    <Group orientation="horizontal">
                        <Panel defaultSize={50} minSize={20}>
                            <div className='relative h-full'>
                                <SandpackCodeEditor
                                    showTabs
                                    style={{
                                        height: '100%'
                                    }}
                                />
                                <CodeEditorChildren onCompleteExercise={onCompleteExercise} IsCompleted={IsCompleted} />
                            </div>
                        </Panel>
                        <Separator className='w-1.5 bg-zinc-700 hover:bg-blue-500 transition-colors' />
                        <Panel defaultSize={50} minSize={20}>
                            <SandpackPreview
                                showNavigator
                                showOpenInCodeSandbox={false}
                                showOpenNewtab
                                style={{
                                    height: '100%'
                                }}
                            />
                        </Panel>
                    </Group>
                </SandpackLayout>
            </SandpackProvider>


        </div >
    )
}

export default CodeEditor