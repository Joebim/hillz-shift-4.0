'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
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
    { name: 'Home', href: '/' },
    {
        name: 'About',
        href: '/about',
        submenu: [
            { name: 'Our Ministry', href: '/about' },
            { name: 'Vision & Mission', href: '/about/vision' },
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
                    {}
                    <Link href="/" className="flex items-center gap-3 group">
                        <img 
                            src="https://res.cloudinary.com/dr1decnfd/image/upload/v1773612049/Hillz_Logo_csgnms.svg" 
                            alt="The Hillz Logo" 
                            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" 
                        />
                        <div className="flex flex-col">
                            <span
                                className={cn(
                                    'text-lg font-black tracking-tighter transition-colors duration-300 leading-none',
                                    isScrolled ? 'text-gray-900' : 'text-white'
                                )}
                            >
                                THE HILLZ
                            </span>
                            <span className={cn(
                                'text-[10px] font-black tracking-[0.2em] transition-colors duration-300',
                                isScrolled ? 'text-purple-600' : 'text-purple-300'
                            )}>
                                CHURCH
                            </span>
                        </div>
                    </Link>

                    {}
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

                    {}
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

                    {}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={cn(
                            'lg:hidden transition-colors duration-300 p-2 rounded-lg',
                            isScrolled ? 'text-[#1F2937] hover:bg-gray-100' : 'text-white hover:bg-white/10'
                        )}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-[#E5E7EB] py-4 shadow-xl animate-in fade-in slide-in-from-top-2">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.submenu ? (
                                    <>
                                        <button
                                            onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                                            className="w-full flex items-center justify-between px-6 py-4 text-[#475569] hover:text-[#6B46C1] font-medium border-b border-gray-50"
                                        >
                                            {item.name}
                                            <ChevronDown
                                                className={cn(
                                                    'w-4 h-4 transition-transform duration-200',
                                                    activeSubmenu === item.name && 'rotate-180'
                                                )}
                                            />
                                        </button>
                                        {activeSubmenu === item.name && (
                                            <div className="bg-gray-50/50 py-2">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block px-10 py-3 text-[#475569] hover:text-[#6B46C1] transition-colors"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="block px-6 py-4 text-[#475569] hover:text-[#6B46C1] font-medium border-b border-gray-50 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div className="flex flex-col gap-3 px-6 pt-6">
                            <Link href="/prayer" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" size="md" className="w-full">
                                    Prayer Request
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};
