"use client";

import AnimatedShapes from '@/components/ui/animatedShape';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Features = () => {
    return (
        <div className="relative px-6 py-12 md:px-12 lg:py-24">
            <AnimatedShapes />
            <div className="flex flex-col bg-gray-50 gap-12 items-center border p-3 md:p-6 lg:p-8 border-gray-300 rounded-md shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8 w-full items-center">

                    <div className="flex flex-col flex-1 gap-4">
                        <span className="text-lg md:text-xl lg:text-2xl font-serif font-semibold">
                            Birthday Shots
                        </span>
                        <p className="text-base md:text-lg font-extralight font-serif leading-relaxed max-w-prose text-gray-700">
                            Celebrate every special moment with high-quality birthday photography.
                            Our professional photographers capture the laughter, joy, and tiny details
                            of your celebration so that you can relive these memories forever.
                            We specialize in creative compositions, vibrant colors, and candid moments
                            that truly represent your unique celebration.
                        </p>

                        <span className="flex items-center gap-3 group cursor-pointer mt-3 bg-gray-700 w-max px-4 py-2 rounded-md font-serif text-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-300">
                            View More
                            <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </span>
                    </div>

                    <div className="flex items-center justify-center flex-1 overflow-hidden rounded-sm shadow-sm w-full md:w-auto">
                        <Image
                            src="/birthday/birthday-1.webp"
                            alt="birthday photo"
                            width={500}
                            height={300}
                            className="object-cover w-full h-full rounded-sm hover:scale-105 transition-all duration-300"
                        />
                    </div>

                </div>
                <div className="flex flex-col lg:flex-row-reverse gap-8 w-full items-center">

                    <div className="flex flex-col flex-1 gap-4">
                        <span className="text-lg md:text-xl lg:text-2xl font-serif font-semibold">
                            Wedding Shots
                        </span>
                        <p className="text-base md:text-lg font-extralight font-serif leading-relaxed max-w-prose text-gray-700">
                            Celebrate every special moment with high-quality birthday photography.
                            Our professional photographers capture the laughter, joy, and tiny details
                            of your celebration so that you can relive these memories forever.
                            We specialize in creative compositions, vibrant colors, and candid moments
                            that truly represent your unique celebration.
                        </p>

                        <span className="flex items-center gap-3 group cursor-pointer mt-3 bg-gray-700 w-max px-4 py-2 rounded-md font-serif text-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-300">
                            View More
                            <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </span>
                    </div>

                    <div className="flex items-center justify-center flex-1 overflow-hidden rounded-sm shadow-sm w-full md:w-auto">
                        <Image
                            src="/wedding/wedding-1.webp"
                            alt="wedding photo"
                            width={500}
                            height={300}
                            className="object-cover w-full h-full rounded-sm hover:scale-105 transition-all duration-300"
                        />
                    </div>

                </div>
                <div className="flex flex-col lg:flex-row gap-8 w-full items-center">

                    <div className="flex flex-col flex-1 gap-4">
                        <span className="text-lg md:text-xl lg:text-2xl font-serif font-semibold">
                            Family Shots
                        </span>
                        <p className="text-base md:text-lg font-extralight font-serif leading-relaxed max-w-prose text-gray-700">
                            Celebrate every special moment with high-quality birthday photography.
                            Our professional photographers capture the laughter, joy, and tiny details
                            of your celebration so that you can relive these memories forever.
                            We specialize in creative compositions, vibrant colors, and candid moments
                            that truly represent your unique celebration.
                        </p>

                        <span className="flex items-center gap-3 group cursor-pointer mt-3 bg-gray-700 w-max px-4 py-2 rounded-md font-serif text-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-300">
                            View More
                            <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </span>
                    </div>

                    <div className="flex items-center justify-center flex-1 overflow-hidden rounded-sm shadow-sm w-full md:w-auto">
                        <Image
                            src="/family/family-1.webp"
                            alt="family photo"
                            width={500}
                            height={300}
                            className="object-cover w-full h-full rounded-sm hover:scale-105 transition-all duration-300"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Features;