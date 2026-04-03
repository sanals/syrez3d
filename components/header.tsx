'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, User, LogOut } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  onCartClick?: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const { itemCount } = useCart()
  const { user, userProfile, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/icons/icon-transparent.png" alt="Syrez Logo" width={32} height={32} className="object-contain group-hover:opacity-80 transition-opacity" />
          <span className="font-serif text-xl font-bold text-foreground">Syrez</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
            About
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-6 h-6 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <User className="w-6 h-6 text-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">
                    {userProfile?.displayName || 'Account'}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
