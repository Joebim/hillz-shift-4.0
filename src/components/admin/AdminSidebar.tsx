'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar, Settings, LogOut, Building,
  Mic, FileText, Sparkles, Menu, X,
  PanelLeftClose, PanelLeftOpen, Image, User, MessageSquare, Heart
} from 'lucide-react';
import { SessionUser, ADMIN_ROLES } from '@/src/types/user';

const allNavigation = [
  { name: 'Events', href: '/admin/events', icon: Calendar, adminOnly: false },
  { name: 'Sermons', href: '/admin/sermons', icon: Mic, adminOnly: true },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText, adminOnly: true },
  { name: 'Ministries', href: '/admin/ministries', icon: Building, adminOnly: true },
  { name: 'Media', href: '/admin/media', icon: Image, adminOnly: true },
  { name: 'Contact Reqs', href: '/admin/requests/contact', icon: MessageSquare, adminOnly: true },
  { name: 'Prayer Reqs', href: '/admin/requests/prayer', icon: Heart, adminOnly: true },
  { name: 'Profile', href: '/admin/profile', icon: User, adminOnly: false },
  { name: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
];

function NavTooltip({ label }: { label: string }) {
  return (
    <span className="
            absolute left-full ml-3 px-2.5 py-1.5 rounded-lg
            bg-slate-800 text-white text-xs font-medium whitespace-nowrap
            opacity-0 group-hover:opacity-100 pointer-events-none
            translate-x-1 group-hover:translate-x-0
            transition-all duration-150 z-50 shadow-xl
        ">
      {label}
    </span>
  );
}

function NavLink({
  item, isActive, collapsed, onClick,
}: {
  item: { name: string; href: string; icon: React.ElementType };
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center rounded-xl transition-all duration-200',
        collapsed ? 'justify-center px-0 py-3 mx-auto w-10 h-10' : 'px-3 py-3 gap-3',
        isActive
          ? 'bg-violet-50 text-violet-600 shadow-sm shadow-violet-100 ring-1 ring-violet-200/50'
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
      )}
    >
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-600 rounded-r-full opacity-0" />
      )}

      <Icon className={cn(
        'shrink-0 transition-transform duration-200 group-hover:scale-105',
        collapsed ? 'w-5 h-5' : 'w-4 h-4',
        isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'
      )} />

      {!collapsed && (
        <span className={cn(
          "text-sm truncate transition-colors",
          isActive ? "font-semibold" : "font-medium"
        )}>{item.name}</span>
      )}

      {collapsed && <NavTooltip label={item.name} />}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  onToggle,
  onLinkClick,
  showToggle = true,
  session,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onLinkClick?: () => void;
  showToggle?: boolean;
  session: SessionUser | null | undefined;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = session ? ADMIN_ROLES.includes(session.role) : false;

  // Filter nav based on role
  const navigation = allNavigation.filter(item =>
    !item.adminOnly || isAdmin
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) { }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/80 backdrop-blur-xl">

      {/* Header */}
      <div className={cn(
        'flex items-center border-b border-slate-100/80 shrink-0 transition-all duration-300',
        collapsed ? 'h-16 justify-center px-0' : 'h-16 px-4 justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200/50 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-700 whitespace-nowrap tracking-tight">
              Admin
            </span>
          </div>
        )}

        {showToggle && (
          <button
            onClick={onToggle}
            className={cn(
              'group flex items-center justify-center rounded-lg transition-all duration-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600',
              collapsed ? 'w-9 h-9' : 'w-8 h-8'
            )}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={cn(
        'flex-1 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none',
        collapsed ? 'px-2' : 'px-3'
      )}>
        {navigation.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname?.startsWith(item.href));
          return (
            <NavLink
              key={item.name}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
              onClick={onLinkClick}
            />
          );
        })}
      </nav>

      {/* Bottom: logout */}
      <div className={cn(
        'shrink-0 border-t border-slate-100/80 py-4 space-y-1',
        collapsed ? 'px-2' : 'px-3'
      )}>
        <button
          onClick={handleLogout}
          className={cn(
            'group relative w-full flex items-center rounded-xl transition-all duration-200 text-slate-400 hover:bg-red-50 hover:text-red-500',
            collapsed ? 'justify-center px-0 py-3 mx-auto w-10 h-10' : 'px-3 py-3 gap-3'
          )}
        >
          <LogOut className={cn(
            'shrink-0 transition-all duration-200 group-hover:-translate-x-0.5',
            collapsed ? 'w-5 h-5' : 'w-4 h-4'
          )} />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          {collapsed && <NavTooltip label="Sign Out" />}
        </button>
      </div>
    </div>
  );
}

export const AdminSidebar = () => {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();

  const { data: session } = useQuery<SessionUser | null>({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session');
      if (!res.ok) return null;
      const json = await res.json();
      return json.data as SessionUser;
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    const t = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isAdmin = session ? ADMIN_ROLES.includes(session.role) : false;
  const mobileNavItems = allNavigation.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile narrow rail */}
      <div className="lg:hidden fixed left-0 top-0 h-full w-14 bg-white/90 backdrop-blur-md border-r border-slate-100 z-30 flex flex-col items-center py-3 gap-2 shadow-sm">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors mb-2"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200/50 mb-4">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        {mobileNavItems.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                isActive
                  ? 'bg-violet-50 text-violet-600 shadow-sm shadow-violet-100'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              )}
            >
              <Icon className="w-4 h-4" />
              <NavTooltip label={item.name} />
            </Link>
          );
        })}
      </div>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          'lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Mobile drawer */}
      <aside className={cn(
        'lg:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors z-10"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent
          collapsed={false}
          onToggle={() => setMobileOpen(false)}
          onLinkClick={() => setMobileOpen(false)}
          showToggle={false}
          session={session}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col h-screen bg-white/50 border-r border-slate-200/60 sticky top-0 z-20 shrink-0 transition-all duration-300 ease-in-out overflow-hidden',
        desktopCollapsed ? 'w-20' : 'w-64'
      )}>
        <SidebarContent
          collapsed={desktopCollapsed}
          onToggle={() => setDesktopCollapsed(prev => !prev)}
          showToggle={true}
          session={session}
        />
      </aside>
    </>
  );
};