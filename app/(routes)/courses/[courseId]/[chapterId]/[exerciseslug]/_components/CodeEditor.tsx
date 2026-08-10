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
import { getLanguageConfig, isWebEditorType } from '@/config/languages';
import ConsoleOutput from './ConsoleOutput';

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
                {IsCompleted ? 'Already Completed' : "Mark Completed"}
            </Button>
        </div>
    )
}

/** Buttons for non-web editor — no "Run Code" here since ConsoleOutput has its own run button */
const NonWebEditorChildren = ({ onCompleteExercise, IsCompleted }: any) => {
    return (
        <div className='flex font-game gap-5 absolute bottom-40 right-5'>
            <Button variant={'pixel'} className='bg-[#a3e534] text-xl' size={'lg'}
                onClick={() => onCompleteExercise()}
                disabled={IsCompleted}
            >
                {IsCompleted ? 'Already Completed' : "Mark Completed"}
            </Button>
        </div>
    )
}


function CodeEditor({ courseExerciseData, loading }: Props) {

    const { exerciseslug } = useParams();

    const editorType = courseExerciseData?.editorType;
    const isWeb = isWebEditorType(editorType);
    const langConfig = getLanguageConfig(editorType);

    // Use actual exercise.id from the database instead of fragile index math
    const currentExercise = courseExerciseData?.exercises?.find(item => item.slug === exerciseslug);

    const IsCompleted = courseExerciseData?.completedExercise?.find((item) => item.exerciseId === currentExercise?.id);

    const onCompleteExercise = async () => {
        if (IsCompleted) {
            toast.error('Exercise already completed');
            return;
        }

        if (!currentExercise) return;

        try {
            const result = await axios.post('/api/exercise/complete', {
                courseId: courseExerciseData?.courseId,
                chapterId: courseExerciseData?.id,
                exerciseId: currentExercise?.id,
                usedHint: false, // TODO: track if user revealed hint
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

    // ─── Web Editor Mode (HTML/CSS/JS — current Sandpack setup) ───
    if (isWeb) {
        return (
            <div>
                <SandpackProvider
                    //@ts-ignore
                    template={courseExerciseData?.editorType ?? 'react'}
                    style={{
                        height: '100vh'
                    }}
                    files={
                        courseExerciseData?.exerciseData?.starterCode
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

    // ─── Non-Web Editor Mode (Python/C++/Java — CodeMirror + Judge0) ───
    const starterFiles = courseExerciseData?.exerciseData?.starterCode || {
        [langConfig!.defaultFilename]: {
            code: langConfig!.defaultCode,
            active: true,
        },
    }

    return (
        <div>
            <SandpackProvider
                template="static"
                style={{
                    height: '100vh'
                }}
                files={starterFiles}
                options={{
                    autorun: false,
                    autoReload: false,
                }}
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
                                    additionalLanguages={[
                                        {
                                            name: langConfig!.name,
                                            extensions: langConfig!.extensions,
                                            language: langConfig!.codemirrorLang(),
                                        },
                                    ]}
                                />
                                <NonWebEditorChildren onCompleteExercise={onCompleteExercise} IsCompleted={IsCompleted} />
                            </div>
                        </Panel>
                        <Separator className='w-1.5 bg-zinc-700 hover:bg-blue-500 transition-colors' />
                        <Panel defaultSize={50} minSize={20}>
                            <ConsoleOutput languageId={langConfig!.judge0Id} />
                        </Panel>
                    </Group>
                </SandpackLayout>
            </SandpackProvider>
        </div>
    )
}

export default CodeEditor