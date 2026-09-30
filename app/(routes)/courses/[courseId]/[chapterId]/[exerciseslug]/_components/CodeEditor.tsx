import React, { useState } from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    useSandpack,
    SandpackFiles,
} from "@codesandbox/sandpack-react";
import { Panel, Group, Separator } from 'react-resizable-panels';
import { CourseExercise } from '../page';
import { CompletedExercises } from '../../../../_components/CourseList';
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
    usedHint: boolean
    onCompleted: (records: CompletedExercises[]) => void
}

type CompleteButtonProps = {
    onCompleteExercise: (files: SandpackFiles) => void
    IsCompleted: boolean
    submitting: boolean
}

const CompleteButton = ({ onCompleteExercise, IsCompleted, submitting }: CompleteButtonProps) => {
    const { sandpack } = useSandpack();

    return (
        <Button variant={'pixel'} className='bg-[#a3e534] text-xl' size={'lg'}
            onClick={() => onCompleteExercise(sandpack.files)}
            disabled={IsCompleted || submitting}
        >
            {IsCompleted ? 'Already Completed' : submitting ? 'Checking...' : "Mark Completed"}
        </Button>
    )
}

const CodeEditorChildren = (props: CompleteButtonProps) => {

    const { sandpack } = useSandpack();


    return (
        <div className='flex font-game gap-5 absolute bottom-40 right-5'>
            <Button variant={'pixel'} size={'lg'} className='text-xl'
                onClick={() => sandpack.runSandpack()}
            >
                Run Code
            </Button>
            <CompleteButton {...props} />
        </div>
    )
}

/** Buttons for non-web editor — no "Run Code" here since ConsoleOutput has its own run button */
const NonWebEditorChildren = (props: CompleteButtonProps) => {
    return (
        <div className='flex font-game gap-5 absolute bottom-40 right-5'>
            <CompleteButton {...props} />
        </div>
    )
}


function CodeEditor({ courseExerciseData, loading, usedHint, onCompleted }: Props) {

    const { exerciseslug } = useParams();
    const [submitting, setSubmitting] = useState(false);

    const editorType = courseExerciseData?.editorType;
    const isWeb = isWebEditorType(editorType);
    const langConfig = getLanguageConfig(editorType);

    // Use actual exercise.id from the database instead of fragile index math
    const currentExercise = courseExerciseData?.exercises?.find(item => item.slug === exerciseslug);

    const IsCompleted = !!courseExerciseData?.completedExercise?.find((item) => item.exerciseId === currentExercise?.id);

    const onCompleteExercise = async (sandpackFiles: SandpackFiles) => {
        if (IsCompleted) {
            toast.error('Exercise already completed');
            return;
        }

        if (!currentExercise) return;

        // Send plain { path: code } so the server can validate the submission
        const files: Record<string, string> = {};
        for (const [path, file] of Object.entries(sandpackFiles)) {
            files[path] = typeof file === 'string' ? file : file.code;
        }

        setSubmitting(true);
        try {
            const result = await axios.post('/api/exercise/complete', {
                exerciseId: currentExercise?.id,
                usedHint,
                files,
            })

            onCompleted(result.data);
            toast.success('Exercise completed successfully');
        } catch (error: any) {
            if (error?.response?.status === 403) {
                toast.error('Please enroll in the course first!');
            } else if (error?.response?.status === 409) {
                toast.error('Exercise already completed!');
            } else if (error?.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setSubmitting(false);
        }
    }

    // Wait for data so Sandpack mounts once with the right starter files
    if (!courseExerciseData) {
        return null;
    }

    // ─── Web Editor Mode (HTML/CSS/JS — current Sandpack setup) ───
    if (isWeb) {
        return (
            <div className="h-full">
                <SandpackProvider
                    key={courseExerciseData?.exerciseData?.id}
                    //@ts-ignore
                    template={courseExerciseData?.editorType ?? 'react'}
                    style={{
                        height: '100%'
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
                                    <CodeEditorChildren onCompleteExercise={onCompleteExercise} IsCompleted={IsCompleted} submitting={submitting} />
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
    if (!langConfig) {
        return (
            <div className='p-10 font-game text-xl text-red-400'>
                Unsupported editor type: {editorType}
            </div>
        )
    }

    const starterFiles = courseExerciseData?.exerciseData?.starterCode || {
        [langConfig.defaultFilename]: {
            code: langConfig.defaultCode,
            active: true,
        },
    }

    return (
        <div className="h-full">
            <SandpackProvider
                key={courseExerciseData?.exerciseData?.id}
                template="static"
                style={{
                    height: '100%'
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
                                            name: langConfig.name,
                                            extensions: langConfig.extensions,
                                            language: langConfig.codemirrorLang(),
                                        },
                                    ]}
                                />
                                <NonWebEditorChildren onCompleteExercise={onCompleteExercise} IsCompleted={IsCompleted} submitting={submitting} />
                            </div>
                        </Panel>
                        <Separator className='w-1.5 bg-zinc-700 hover:bg-blue-500 transition-colors' />
                        <Panel defaultSize={50} minSize={20}>
                            <ConsoleOutput languageId={langConfig.judge0Id} />
                        </Panel>
                    </Group>
                </SandpackLayout>
            </SandpackProvider>
        </div>
    )
}

export default CodeEditor