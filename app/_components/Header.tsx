"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { useParams, usePathname } from 'next/navigation'
import axios from 'axios'
import { Course } from '../(routes)/courses/_components/CourseList'
import { Menu } from 'lucide-react'



const courses = [
    {
        id: 1,
        name: 'HTML',
        desc: 'Learn the fundamentals of HTML and build the structure of modern web pages.',
        path: '/course/1/detail'
    },
    {
        id: 2,
        name: 'CSS',
        desc: 'Master CSS to style and design responsive, visually appealing web layouts.',
        path: '/course/2/detail'
    },
    {
        id: 3,
        name: 'React',
        desc: 'Build dynamic and interactive web applications using the React JavaScript library.',
        path: '/course/3/detail'
    },
    {
        id: 4,
        name: 'React Advanced',
        desc: 'Deep dive into advanced React concepts including hooks, state management, performance optimization, and architectural patterns.',
        path: '/course/4/detail'
    },
    {
        id: 5,
        name: 'Python',
        desc: 'Learn Python programming from basics to intermediate level, covering logic building, functions, and real-world applications.',
        path: '/course/5/detail'
    },
    {
        id: 6,
        name: 'Python Advanced',
        desc: 'Master advanced Python concepts such as OOP, modules, APIs, data processing, and automation.',
        path: '/course/6/detail'
    },
    {
        id: 7,
        name: 'Generative AI',
        desc: 'Explore prompt engineering, LLMs, embeddings, image generation, and build GenAI-powered applications.',
        path: '/course/7/detail'
    },
    {
        id: 8,
        name: 'Machine Learning',
        desc: 'Understand ML concepts, algorithms, data preprocessing, model training, evaluation, and deployment.',
        path: '/course/8/detail'
    },
    {
        id: 9,
        name: 'JavaScript',
        desc: 'Learn core JavaScript concepts, asynchronous programming, DOM manipulation, and modern ES6+ features.',
        path: '/course/9/detail'
    }
];



function Header() {
    const { user } = useUser();

    const path = usePathname();
    const { exerciseslug } = useParams();

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const GetCourses = async () => {
        try {
            const result = await axios.get('/api/course');
            console.log("api result", result.data.result);
            setAllCourses(result.data.result ?? []);
        } catch (error: any) {
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        GetCourses();
    }, []);

    return (
        <div className='p-4 max-w-7xl flex justify-between items-center w-full'>
            <div className='flex gap-2 items-center'>
                {/* mobile menu button */}
                {
                    !exerciseslug &&
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant='ghost' size='icon' className='sm:hidden cursor-pointer'>
                                <Menu className='w-6 h-6' />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='left' className='w-[280px] bg-zinc-950 border-zinc-800'>
                            <SheetHeader>
                                <SheetTitle className='font-game text-2xl flex items-center gap-2'>
                                    <Image src={'/angry.png'} alt='logo' width={30} height={30} />
                                    DevArcade
                                </SheetTitle>
                            </SheetHeader>
                            <nav className='flex flex-col gap-1 mt-6 px-2'>
                                <h3 className='font-game text-lg text-gray-400 mb-2'>Courses</h3>
                                {allCourses?.map((course, index) => (
                                    <Link
                                        key={index}
                                        href={'/courses/' + course?.courseId}
                                        onClick={() => setMobileOpen(false)}
                                        className='p-3 hover:bg-zinc-800 rounded-xl cursor-pointer'
                                    >
                                        <h2 className='font-medium text-sm'>{course.title}</h2>
                                    </Link>
                                ))}

                                <div className='border-t border-zinc-800 my-3' />

                                <Link href='/' onClick={() => setMobileOpen(false)}
                                    className='p-3 hover:bg-zinc-800 rounded-xl font-game text-lg'>
                                    Contest
                                </Link>
                                {/* <Link href='/' onClick={() => setMobileOpen(false)}
                                    className='p-3 hover:bg-zinc-800 rounded-xl font-game text-lg'>
                                    Projects
                                </Link> */}
                                <Link href='/pricing' onClick={() => setMobileOpen(false)}
                                    className='p-3 hover:bg-zinc-800 rounded-xl font-game text-lg'>
                                    Pricing
                                </Link>
                                <Link href='/contact-us' onClick={() => setMobileOpen(false)}
                                    className='p-3 hover:bg-zinc-800 rounded-xl font-game text-lg'>
                                    Contact Us
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                }
                <Link href="/" className='flex gap-2 items-center height-[28px]'>
                    <Image src={'/angry.png'} alt="logo" width={40} height={40} />
                    <h2 className='font-bold max-sm:hidden text-3xl font-game'>DevArcade</h2>
                </Link>
            </div>

            {/* desktop navbar */}

            {
                !exerciseslug ?
                    <NavigationMenu className='max-sm:hidden'>
                        <NavigationMenuList className='gap-2'>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className='grid md:grid-cols-2 gap-2 sm:w-[400px] md:w-[500px] lg:w-[600px] p-2'>
                                        {
                                            allCourses?.map((course, index) => {
                                                return (
                                                    <Link key={index} href={'/courses/' + course?.courseId}>
                                                        <li className='p-3 hover:bg-accent rounded-xl cursor-pointer'>
                                                            <h2 className='font-medium'>{course.title}</h2>
                                                            <p className='text-sm text-gray-500'>{course.desc}</p>
                                                        </li>
                                                    </Link>
                                                )
                                            })
                                        }
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/">Contest</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            {/* <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/">Projects</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem> */}
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/pricing">Pricing</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/contact-us">Contact Us</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    :

                    <h2 className='text-2xl font-game'>
                        {exerciseslug?.toString().replaceAll("-", " ").toUpperCase()}
                    </h2>

            }

            {/* signup */}
            {
                !user ?
                    <Link href={'/sign-in'}>
                        <Button className='font-game text-2xl' variant={'pixel'}>Signup</Button>
                    </Link>
                    : <div className='flex gap-4 items-center'>
                        <Link href={'/dashboard'}>
                            <Button className='font-game text-2xl' variant={'pixel'}>Dashboard</Button>
                        </Link>
                        <UserButton />
                    </div>
            }
        </div>
    )
}

export default Header