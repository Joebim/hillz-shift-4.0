'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/src/components/ui/NavigationMenu';

const navigation = [
    {
        name: 'About',
        href: '/about',
        submenu: [
            { name: 'Our Ministry', href: '/about' },
            { name: 'Our Mandate', href: '/about/mandate' },
            { name: 'Leadership', href: '/about/leadership' },
            { name: 'History', href: '/about/history' },
        ],
    },
    { name: 'Events', href: '/events' },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Ministries', href: '/ministries' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
];

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                isScrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 h-16 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]'
                    : 'bg-transparent h-24'
            )}
        >
            <nav className="container mx-auto px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    { }
                    <Link href="/" className="flex items-center group">
                        <img
                            src={isScrolled ? "/icons/hillz-logo-light-transparent.svg" : "/icons/hillz-logo-dark-transparent.svg"}
                            alt="The Hillz Logo"
                            className={cn(
                                "w-auto object-contain transition-all duration-300 group-hover:scale-105",
                                isScrolled ? "h-14" : "h-16"
                            )}
                        />
                    </Link>

                    { }
                    <div className="hidden lg:flex items-center gap-2">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navigation.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        {item.submenu ? (
                                            <>
                                                <NavigationMenuTrigger
                                                    className={cn(
                                                        'bg-transparent font-bold text-sm tracking-tight transition-all duration-300',
                                                        isScrolled
                                                            ? 'text-gray-600 hover:text-purple-600'
                                                            : 'text-white/80 hover:text-white'
                                                    )}
                                                >
                                                    {item.name}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[400px] gap-2 p-4 md:w-[250px] lg:w-[300px] grid-cols-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100">
                                                        {item.submenu.map((subItem) => (
                                                            <li key={subItem.name}>
                                                                <NavigationMenuLink asChild>
                                                                    <Link
                                                                        href={subItem.href}
                                                                        className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-purple-50 hover:text-purple-600 group"
                                                                    >
                                                                        <div className="text-sm font-bold leading-none tracking-tight">
                                                                            {subItem.name}
                                                                        </div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        'bg-transparent font-bold text-sm tracking-tight transition-all duration-300 focus:bg-transparent active:bg-transparent px-4 py-2 rounded-full',
                                                        isScrolled
                                                            ? 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
                                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    { }
                    <div className="hidden lg:flex items-center gap-4">
                        <Link href="/prayer">
                            <Button
                                variant={isScrolled ? 'outline' : 'ghost'}
                                size="sm"
                                className={cn(
                                    'transition-all duration-300 rounded-full font-bold px-6',
                                    !isScrolled && 'text-white border-white/20 hover:bg-white/10'
                                )}
                            >
                                Prayer
                            </Button>
                        </Link>
                    </div>

                    { }
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={cn(
                            'lg:hidden transition-all duration-300 p-2 rounded-lg relative w-10 h-10 flex items-center justify-center',
                            isScrolled ? 'text-[#1F2937] hover:bg-gray-100' : 'text-white hover:bg-white/10'
                        )}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mobileMenuOpen ? 'close' : 'open'}
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>

                { }
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-[#E5E7EB] overflow-hidden shadow-2xl"
                        >
                            <div className="py-6 bg-linear-to-b from-white to-slate-50/50">
                                {navigation.map((item, idx) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        {item.submenu ? (
                                            <>
                                                <button
                                                    onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                                                    className="w-full flex items-center justify-between px-8 py-4 text-slate-600 hover:text-purple-600 font-bold transition-all group"
                                                >
                                                    <span className="text-lg tracking-tight">{item.name}</span>
                                                    <ChevronDown
                                                        className={cn(
                                                            'w-5 h-5 transition-transform duration-300 text-slate-400 group-hover:text-purple-600',
                                                            activeSubmenu === item.name && 'rotate-180'
                                                        )}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {activeSubmenu === item.name && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="bg-slate-50/80 border-y border-slate-100 overflow-hidden"
                                                        >
                                                            <div className="py-2">
                                                                {item.submenu.map((subItem) => (
                                                                    <Link
                                                                        key={subItem.name}
                                                                        href={subItem.href}
                                                                        className="block px-12 py-3.5 text-slate-500 hover:text-purple-600 font-medium transition-all"
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                    >
                                                                        {subItem.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="block px-8 py-4 text-slate-600 hover:text-purple-600 font-bold text-lg tracking-tight transition-all border-b border-gray-50/50"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: navigation.length * 0.05 + 0.1 }}
                                    className="flex flex-col gap-4 px-8 pt-8"
                                >
                                    <Link href="/prayer" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl">
                                            Prayer Request
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

