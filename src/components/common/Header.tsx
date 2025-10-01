"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Wheat, Menu, ShoppingCart, User, Search } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Crops", href: "/category/crops" },
    { name: "Vegetables", href: "/category/vegetables" },
    { name: "Dairy", href: "/category/dairy" },
    { name: "Fish", href: "/category/fish" },
  ];

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
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              0
            </Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">Sign In</Button>
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
                
                <div className="flex flex-col gap-2 border-t pt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Sign In
                  </Button>
                  <Button variant="outline" className="w-full">
                    Register
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}