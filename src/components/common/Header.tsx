"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Wheat, Menu, ShoppingCart, User, Search, LogOut, Settings, Package, BarChart3 } from "lucide-react";
import { getUserRoleDisplayName, getUserRoleColor } from "@/lib/auth/permissions";

export function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Crops", href: "/category/crops" },
    { name: "Vegetables", href: "/category/vegetables" },
    { name: "Dairy", href: "/category/dairy" },
    { name: "Fish", href: "/category/fish" },
  ];

  const getUserDashboardLink = () => {
    if (!session?.user?.role) return "/";
    
    const dashboardLinks = {
      ADMIN: "/admin",
      CUSTOMER: "/profile",
      SHOP_OWNER: "/shop",
      SELLER: "/seller",
      RIDER: "/rider",
    };
    
    return dashboardLinks[session.user.role] || "/";
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Wheat className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-800">AgroMart</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] grid-cols-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{category.name}</div>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link href="/sellers" className="text-gray-600 hover:text-gray-900 transition-colors">
            For Sellers
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          {session?.user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  0
                </Badge>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-10">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{session.user.name}</span>
                      <Badge className={`text-xs ${getUserRoleColor(session.user.role)}`}>
                        {getUserRoleDisplayName(session.user.role)}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getUserDashboardLink()} className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "CUSTOMER" && (
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <Wheat className="h-6 w-6 text-green-600" />
                  <span className="text-xl font-bold">AgroMart</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block py-2 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  <Link
                    href="/sellers"
                    className="block py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    For Sellers
                  </Link>
                  <Link
                    href="/about"
                    className="block py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  {session?.user ? (
                    <>
                      <div className="flex items-center gap-3 pb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                          <AvatarFallback>
                            {session.user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{session.user.name}</span>
                          <Badge className={`text-xs w-fit ${getUserRoleColor(session.user.role)}`}>
                            {getUserRoleDisplayName(session.user.role)}
                          </Badge>
                        </div>
                      </div>
                      <Link
                        href={getUserDashboardLink()}
                        className="block py-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block py-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      {session.user.role === "CUSTOMER" && (
                        <Link
                          href="/orders"
                          className="block py-2 text-gray-600 hover:text-gray-900"
                          onClick={() => setIsOpen(false)}
                        >
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                        <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}