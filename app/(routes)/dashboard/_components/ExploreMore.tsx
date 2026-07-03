import Image from 'next/image';
import React from 'react'

const ExplorMoreOptions = [
    {
        id: 1,
        title: 'Quizz Pack',
        desc: 'Practice what you learned with bite-sized code challenges.',
        icon: '/tree.png'
    },
    {
        id: 2,
        title: 'Video Courses',
        desc: 'Learn with structured video lessons taught step-by-step.',
        icon: '/game.png'
    },
    {
        id: 3,
        title: 'Community Project',
        desc: 'Build real-world apps by collaborating with the community.',
        icon: '/growth.png'
    },
    {
        id: 4,
        title: 'Explore Apps',
        desc: 'Explore prebuild app which you can try demo and build.',
        icon: '/start-up.png'
    }
];


function ExploreMore() {
    return (
        <div>
            <h2 className='font-game max-sm:text-2xl text-3xl mb-2'>
                Explore More
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 '>
                {ExplorMoreOptions.map((option, index) => (
                    <div key={index} className='flex gap-2 p-2 border rounded-xl'>
                        <Image src={option.icon} alt={option.title} width={80} height={80}
                            className='max-sm:w-[50px] max-sm:h-[50px]'
                        />
                        <div className=''>
                            <h2 className='font-medium font-game max-sm:text-xl text-2xl'>{option.title}</h2>
                            <p className='max-sm:text-sm'>{option.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExploreMore