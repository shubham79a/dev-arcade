'use client'

import { Panel, Group, Separator } from 'react-resizable-panels';

function Playground() {
    return (
        <div className='h-[calc(100vh-80px)] border-t-4'>
            <Group orientation="horizontal">
                <Panel defaultSize={40} minSize={20}>
                    <div className='h-full p-4'>
                        Content
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

