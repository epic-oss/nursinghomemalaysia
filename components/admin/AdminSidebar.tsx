'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊', badge: null },
    { href: '/admin/listings', label: 'All Listings', icon: '📝', badge: null },
    { href: '/admin/vendors', label: 'Vendors', icon: '👥', badge: null },
    { href: '/admin/premium', label: 'Premium', icon: '💰', badge: null },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-md bg-zinc-900 p-2 text-white lg:hidden dark:bg-zinc-50 dark:text-zinc-900"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-white transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-900`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-zinc-200 px-6 py-6 dark:border-zinc-800">
            <Link href="/admin" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Team Building MY
            </Link>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-500">{userEmail}</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
    </>
  )
}
