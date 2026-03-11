"use client";

import React from "react";
import Link from "next/link";
import {
    Camera,
    Mail,
    Phone,
    MapPin,
    Instagram,
    Facebook,
    Twitter
} from "lucide-react";

const FrontFooter = () => {
    return (
        <footer className="bg-gray-950/95 px-6 md:px-8 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-14">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-xl font-serif font-semibold text-white">
                            <Camera size={22} />
                            Studio
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed">
                            We capture your most precious moments with creativity and
                            passion. From weddings to birthdays, family portraits,
                            maternity sessions and kids photography.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-serif text-lg text-white">Navigation</h3>

                        <ul className="flex flex-col gap-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-white transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="hover:text-white transition">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <h3 className="font-serif text-lg text-white">Contact</h3>

                        <ul className="flex flex-col gap-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone size={16} />
                                +251 900 000 000
                            </li>

                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                studio@email.com
                            </li>

                            <li className="flex items-center gap-2">
                                <MapPin size={16} />
                                Addis Ababa, Ethiopia
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-serif text-lg text-white">Follow Us</h3>

                        <p className="text-sm text-gray-400">
                            Follow our latest photography sessions and creative work.
                        </p>

                        <div className="flex gap-3">
                            <a className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition">
                                <Instagram size={18} />
                            </a>

                            <a className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition">
                                <Facebook size={18} />
                            </a>

                            <a className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="my-10 border-gray-800" />

                <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-3">
                    <span>
                        © {new Date().getFullYear()} Studio Photography. All rights reserved.
                    </span>

                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-gray-300 transition">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-gray-300 transition">
                            Terms
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default FrontFooter;