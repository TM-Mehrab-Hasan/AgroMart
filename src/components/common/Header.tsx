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
import { 
  Search, 
  ShoppingCart, 
  User, 
  Bell, 
  ChevronDown, 
  Wheat, 
  Leaf, 
  Fish, 
  Milk,
  Apple,
  Beef,
  Shield,
  BarChart3,
  Package,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { getUserRoleDisplayName, getUserRoleColor } from "@/lib/auth/permissions";

export function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Crops", href: "/categories/crops", icon: Wheat, description: "Rice, wheat, grains" },
    { name: "Vegetables", href: "/categories/vegetables", icon: Leaf, description: "Fresh produce" },
    { name: "Fruits", href: "/categories/fruits", icon: Apple, description: "Seasonal & exotic fruits" },
    { name: "Dairy", href: "/categories/dairy", icon: Milk, description: "Milk, cheese, yogurt" },
    { name: "Fish", href: "/categories/fish", icon: Fish, description: "Fresh fish & seafood" },
    { name: "Meat", href: "/categories/meat", icon: Beef, description: "Poultry, beef, goat" },
    { name: "Grains", href: "/categories/grains", icon: Wheat, description: "Pulses & grain products" },
    { name: "Organic", href: "/categories/organic", icon: Shield, description: "Certified organic" },
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
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white via-green-50 to-white backdrop-blur-sm shadow-sm supports-[backdrop-filter]:bg-white/90">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
            <Wheat className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            AgroMart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-green-50 data-[state=open]:bg-green-50">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-6 w-[500px] grid-cols-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="group block p-4 rounded-lg hover:bg-green-50 transition-all duration-200 border border-transparent hover:border-green-200 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                              <IconComponent className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-green-700">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500 group-hover:text-green-600">
                                {category.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link href="/sellers" className="text-gray-600 hover:text-green-600 transition-all duration-200 font-medium hover:bg-green-50 px-3 py-2 rounded-lg">
            For Sellers
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-green-600 transition-all duration-200 font-medium hover:bg-green-50 px-3 py-2 rounded-lg">
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hover:bg-green-50 hover:text-green-600">
            <Search className="h-5 w-5" />
          </Button>
          
          {session?.user ? (
            <>
              <Button variant="ghost" size="icon" className="relative hover:bg-green-50 hover:text-green-600">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-600 hover:bg-green-700">
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
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center gap-3 py-3 px-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-400">{category.description}</div>
                        </div>
                      </Link>
                    );
                  })}
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