'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, MessageSquare, Send, Globe, Code2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

function ContactUs() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields')
            return
        }

        setLoading(true)

        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success('Message sent successfully! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setLoading(false)
    }

    return (
        <div className='min-h-screen'>
            {/* Header Section */}
            <div className='flex flex-col items-center justify-center pt-14 pb-12 px-4'>
                <h2 className='text-5xl md:text-6xl font-game text-center'>
                    Contact <span className='text-yellow-400'>Us</span>
                </h2>
                <p className='font-game text-xl md:text-2xl text-gray-400 mt-4 text-center max-w-2xl'>
                    Have a question, feedback, or just want to say hi? We'd love to hear from you!
                </p>
            </div>

            {/* Content */}
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 px-6 md:px-16 lg:px-32 pb-20'>

                {/* Contact Form */}
                <div className='lg:col-span-3 border-4 rounded-2xl p-8 max-sm:p-4'>
                    <h3 className='font-game text-3xl mb-6'>Send a Message</h3>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div>
                                <label className='font-game text-lg text-gray-300 mb-2 block'>
                                    Name <span className='text-red-500'>*</span>
                                </label>
                                <Input
                                    name='name'
                                    placeholder='Your Name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='bg-zinc-900 border-2 border-zinc-700 rounded-xl h-12 font-game text-lg
                                    focus:border-yellow-400 transition-colors'
                                />
                            </div>
                            <div>
                                <label className='font-game text-lg text-gray-300 mb-2 block'>
                                    Email <span className='text-red-500'>*</span>
                                </label>
                                <Input
                                    name='email'
                                    type='email'
                                    placeholder='your@email.com'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='bg-zinc-900 border-2 border-zinc-700 rounded-xl h-12 font-game text-lg
                                    focus:border-yellow-400 transition-colors'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='font-game text-lg text-gray-300 mb-2 block'>
                                Subject
                            </label>
                            <Input
                                name='subject'
                                placeholder='What is this about?'
                                value={formData.subject}
                                onChange={handleChange}
                                className='bg-zinc-900 border-2 border-zinc-700 rounded-xl h-12 font-game text-lg
                                focus:border-yellow-400 transition-colors'
                            />
                        </div>

                        <div>
                            <label className='font-game text-lg text-gray-300 mb-2 block'>
                                Message <span className='text-red-500'>*</span>
                            </label>
                            <Textarea
                                name='message'
                                placeholder='Write your message here...'
                                value={formData.message}
                                onChange={handleChange}
                                rows={6}
                                className='bg-zinc-900 border-2 border-zinc-700 rounded-xl font-game text-lg
                                focus:border-yellow-400 transition-colors resize-none'
                            />
                        </div>

                        <Button
                            type='submit'
                            variant={'pixel'}
                            size={'lg'}
                            className='font-game text-2xl cursor-pointer w-full md:w-auto'
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : (
                                <span className='flex items-center gap-2'>
                                    <Send className='w-5 h-5' /> Send Message
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Sidebar Info */}
                <div className='lg:col-span-2 space-y-6'>

                    {/* Contact Info Card */}
                    <div className='border-4 rounded-2xl p-6 max-sm:p-4'>
                        <h3 className='font-game text-3xl mb-5'>Get in Touch</h3>

                        <div className='space-y-5'>
                            <div className='flex items-start gap-4'>
                                <div className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0'>
                                    <Mail className='w-5 h-5 text-yellow-400' />
                                </div>
                                <div>
                                    <h4 className='font-game text-xl'>Email</h4>
                                    <p className='text-gray-400 font-game text-lg'>support@devarcade.com</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0'>
                                    <MessageSquare className='w-5 h-5 text-yellow-400' />
                                </div>
                                <div>
                                    <h4 className='font-game text-xl'>Community</h4>
                                    <p className='text-gray-400 font-game text-lg'>Join our Discord server</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0'>
                                    <MapPin className='w-5 h-5 text-yellow-400' />
                                </div>
                                <div>
                                    <h4 className='font-game text-xl'>Location</h4>
                                    <p className='text-gray-400 font-game text-lg'>Remote — Worldwide</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links Card */}
                    <div className='border-4 rounded-2xl p-6 max-sm:p-4'>
                        <h3 className='font-game text-3xl mb-5'>Follow Us</h3>
                        <div className='flex gap-4'>
                            <a href='#' className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center
                                hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer'>
                                <Code2 className='w-5 h-5' />
                            </a>
                            <a href='#' className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center
                                hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer'>
                                <Globe className='w-5 h-5' />
                            </a>
                            <a href='#' className='w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center
                                hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer'>
                                <MessageSquare className='w-5 h-5' />
                            </a>
                        </div>
                    </div>

                    {/* FAQ Teaser */}
                    <div className='border-4 rounded-2xl p-6 bg-zinc-900 max-sm:p-4'>
                        <h3 className='font-game text-2xl mb-3'>Quick Answers</h3>
                        <div className='space-y-4'>
                            <div>
                                <h4 className='font-game text-lg text-yellow-400'>How do I enroll in a course?</h4>
                                <p className='text-gray-400 text-sm font-game'>Sign up, browse courses, and click "Enroll" — it's that simple!</p>
                            </div>
                            <div>
                                <h4 className='font-game text-lg text-yellow-400'>Is there a free plan?</h4>
                                <p className='text-gray-400 text-sm font-game'>Yes! The first 2 chapters of every course are free for enrolled users.</p>
                            </div>
                            <div>
                                <h4 className='font-game text-lg text-yellow-400'>How do I upgrade to Pro?</h4>
                                <p className='text-gray-400 text-sm font-game'>Head to the Pricing page and pick the plan that suits you.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ContactUs
