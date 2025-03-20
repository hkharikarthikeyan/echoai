"use client"

import Link from "next/link"
import { Award, Menu, ShoppingBag, User, Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export function SiteHeader() {
  const { user, logout, connectWallet } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Get cart count from localStorage
  useEffect(() => {
    const getCartCount = () => {
      if (typeof window !== "undefined") {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        setCartCount(cart.reduce((total, item) => total + item.quantity, 0))
      }
    }

    getCartCount()
    window.addEventListener("storage", getCartCount)

    return () => {
      window.removeEventListener("storage", getCartCount)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleConnectWallet = async () => {
    const result = await connectWallet()
    if (result.success) {
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected.",
      })
    } else {
      toast({
        title: "Connection failed",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Recycle className="h-6 w-6 text-green-600" />
          <span className="font-bold">EcoRecycle</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/ewaste" className="text-sm font-medium transition-colors hover:text-primary">
            E-Waste Info
          </Link>
          <Link href="/collection-centers" className="text-sm font-medium transition-colors hover:text-primary">
            Collection Centers
          </Link>
          <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">
            Shop
          </Link>
        </nav>
        <div className="flex items-center ml-auto space-x-2">
          <Link href="/shop/cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/rewards" className="cursor-pointer flex items-center">
                    <Award className="mr-2 h-4 w-4" /> Rewards
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/orders" className="cursor-pointer flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Orders
                  </Link>
                </DropdownMenuItem>
                {!user.walletAddress && (
                  <DropdownMenuItem onClick={handleConnectWallet} className="cursor-pointer flex items-center">
                    <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/ewaste" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  E-Waste Info
                </Link>
                <Link
                  href="/collection-centers"
                  className="text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Collection Centers
                </Link>
                <Link href="/shop" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Shop
                </Link>
                {!user ? (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false)
                      }}
                      asChild
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setMobileMenuOpen(false)
                      }}
                      asChild
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false)
                      }}
                      asChild
                    >
                      <Link href="/profile">My Profile</Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false)
                      }}
                      asChild
                    >
                      <Link href="/profile/rewards">My Rewards</Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false)
                      }}
                      asChild
                    >
                      <Link href="/profile/orders">My Orders</Link>
                    </Button>
                    {!user.walletAddress && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleConnectWallet()
                          setMobileMenuOpen(false)
                        }}
                      >
                        Connect Wallet
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function Recycle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  )
}

