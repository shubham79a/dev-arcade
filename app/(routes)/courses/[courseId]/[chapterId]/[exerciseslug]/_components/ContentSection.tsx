import React from 'react'
import { CourseExercise } from '../page'
import { Skeleton } from '@/components/ui/skeleton'
import { Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
    courseExerciseData?: CourseExercise | undefined
    loading: boolean
    hintRevealed: boolean
    onRevealHint: () => void
}

function ContentSection({ courseExerciseData, loading, hintRevealed, onRevealHint }: Props) {

    const contentInfo = courseExerciseData?.exerciseData;

    return (
        <div className='p-10 mb-32 '>
            {
                loading || !contentInfo
                    ?
                    <Skeleton className='h-full w-full m-10 rounded-2xl' />
                    :
                    <div>
                        <h2 className='font-game text-3xl my-3'>{contentInfo?.name}</h2>
                        <div dangerouslySetInnerHTML={{ __html: contentInfo?.content || '' }} />

                        <div>
                            <h2 className='font-game text-3xl mt-4'> Task</h2>
                            <div className='p-4 border rounded-2xl bg-zinc-800' dangerouslySetInnerHTML={{__html:contentInfo.task}}></div>
                        </div>

                        <div>
                            <h2 className='font-game text-3xl mt-4 flex gap-2 items-center text-yellow-400'> <Lightbulb /> Hint</h2>
                            {
                                hintRevealed
                                    ? <div className='p-4 border rounded-2xl bg-zinc-800' dangerouslySetInnerHTML={{ __html: contentInfo.hint }}></div>
                                    : <div className='p-4 border rounded-2xl bg-zinc-800 flex items-center justify-between gap-3'>
                                        <p className='text-gray-400'>
                                            Stuck? Revealing the hint
                                            {contentInfo.hintXpPenalty > 0 && <> costs <span className='text-yellow-400'>{contentInfo.hintXpPenalty} XP</span></>}.
                                        </p>
                                        <Button variant={'pixel'} className='font-game' onClick={onRevealHint}>Reveal Hint</Button>
                                    </div>
                            }
                        </div>


                    </div>
            }
        </div>
    )
}
 
export default ContentSection