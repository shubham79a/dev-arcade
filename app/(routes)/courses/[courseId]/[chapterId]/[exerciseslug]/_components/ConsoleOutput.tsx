'use client'

import React, { useState } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import axios from 'axios'
import { Loader2, Play, Trash2 } from 'lucide-react'

type Props = {
    languageId: number
}

type ExecutionStatus = {
    id: number
    description: string
}

function ConsoleOutput({ languageId }: Props) {
    const { sandpack } = useSandpack()
    const [output, setOutput] = useState('')
    const [error, setError] = useState('')
    const [compileOutput, setCompileOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [executionInfo, setExecutionInfo] = useState<{
        time: string | null
        memory: number | null
        status: ExecutionStatus | null
    }>({ time: null, memory: null, status: null })

    const handleRun = async () => {
        const activeFile = sandpack.activeFile
        const code = sandpack.files[activeFile]?.code || ''

        if (!code.trim()) {
            setError('No code to run.')
            return
        }

        setIsRunning(true)
        setOutput('')
        setError('')
        setCompileOutput('')
        setExecutionInfo({ time: null, memory: null, status: null })

        try {
            const result = await axios.post('/api/execute', {
                code,
                languageId,
                stdin: '',
            })

            const data = result.data

            if (data.stdout) setOutput(data.stdout)
            if (data.stderr) setError(data.stderr)
            if (data.compile_output) setCompileOutput(data.compile_output)

            setExecutionInfo({
                time: data.time,
                memory: data.memory,
                status: data.status,
            })
        } catch (err: any) {
            if (err?.response?.data?.error) {
                setError(err.response.data.error)
            } else {
                setError('Execution failed. Please try again.')
            }
        } finally {
            setIsRunning(false)
        }
    }

    const handleClear = () => {
        setOutput('')
        setError('')
        setCompileOutput('')
        setExecutionInfo({ time: null, memory: null, status: null })
    }

    const getStatusColor = (statusId: number | undefined) => {
        if (!statusId) return '#94a3b8' // gray
        if (statusId === 3) return '#4ade80'  // green — Accepted
        if (statusId === 6) return '#fb923c'  // orange — Compilation Error
        return '#ef4444' // red — Runtime Error, TLE, etc.
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: '#011627',
                color: '#d6deeb',
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                fontSize: '14px',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: '1px solid #1d3b53',
                    backgroundColor: '#011627',
                }}
            >
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#7fdbca' }}>
                    Console Output
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleClear}
                        style={{
                            background: 'transparent',
                            border: '1px solid #1d3b53',
                            color: '#7fdbca',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#7fdbca'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#1d3b53'
                        }}
                    >
                        <Trash2 size={13} />
                        Clear
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        style={{
                            background: isRunning ? '#1d3b53' : '#22d3ee',
                            border: 'none',
                            color: isRunning ? '#7fdbca' : '#011627',
                            padding: '4px 14px',
                            borderRadius: '6px',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: 700,
                            transition: 'all 0.2s',
                        }}
                    >
                        {isRunning ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play size={13} fill="#011627" />
                                Run Code
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Output Area */}
            <div
                style={{
                    flex: 1,
                    padding: '16px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {/* No output yet */}
                {!output && !error && !compileOutput && !isRunning && (
                    <div style={{ color: '#546e7a', fontStyle: 'italic' }}>
                        Click "Run Code" to see output here...
                    </div>
                )}

                {/* Running indicator */}
                {isRunning && (
                    <div style={{ color: '#7fdbca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={16} className="animate-spin" />
                        Executing code...
                    </div>
                )}

                {/* Compilation errors */}
                {compileOutput && (
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ color: '#fb923c', fontWeight: 600, marginBottom: '4px', fontSize: '12px' }}>
                            ⚠ Compilation Error:
                        </div>
                        <pre style={{ color: '#fb923c', margin: 0, fontSize: '13px' }}>
                            {compileOutput}
                        </pre>
                    </div>
                )}

                {/* Stderr */}
                {error && (
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: '4px', fontSize: '12px' }}>
                            ✕ Error:
                        </div>
                        <pre style={{ color: '#ef4444', margin: 0, fontSize: '13px' }}>
                            {error}
                        </pre>
                    </div>
                )}

                {/* Stdout */}
                {output && (
                    <pre style={{ color: '#d6deeb', margin: 0, fontSize: '13px' }}>
                        {output}
                    </pre>
                )}
            </div>

            {/* Status Bar */}
            {executionInfo.status && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 16px',
                        borderTop: '1px solid #1d3b53',
                        fontSize: '11px',
                        color: '#546e7a',
                    }}
                >
                    <span style={{ color: getStatusColor(executionInfo.status?.id) }}>
                        {executionInfo.status?.description}
                    </span>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {executionInfo.time && (
                            <span>⏱ {executionInfo.time}s</span>
                        )}
                        {executionInfo.memory && (
                            <span>💾 {(executionInfo.memory / 1024).toFixed(1)} MB</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ConsoleOutput
