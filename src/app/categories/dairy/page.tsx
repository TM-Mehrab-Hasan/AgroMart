"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Milk, ArrowLeft, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatBDTaka } from "@/lib/api/landing";

export default function DairyPage() {
  const dairyProducts = [
    {
      id: 1,
      name: "Fresh Cow Milk",
      price: 60,
      unit: "liter",
      image: "/api/placeholder/300/200",
      seller: "Dairy Fresh Farm",
      rating: 4.8,
      inStock: true,
      description: "Pure cow milk, daily fresh"
    },
    {
      id: 2,
      name: "Greek Yogurt",
      price: 120,
      unit: "500g",
      image: "/api/placeholder/300/200",
      seller: "Healthy Dairy Co.",
      rating: 4.6,
      inStock: true,
      description: "Thick creamy Greek yogurt"
    },
    {
      id: 3,
      name: "Cottage Cheese",
      price: 180,
      unit: "250g",
      image: "/api/placeholder/300/200",
      seller: "Farm House Dairy",
      rating: 4.4,
      inStock: false,
      description: "Fresh cottage cheese"
    },
    {
      id: 4,
      name: "Butter",
      price: 200,
      unit: "500g",
      image: "/api/placeholder/300/200",
      seller: "Golden Dairy",
      rating: 4.7,
      inStock: true,
      description: "Pure butter from cream"
    },
    {
      id: 5,
      name: "Cheese Slices",
      price: 150,
      unit: "200g",
      image: "/api/placeholder/300/200",
      seller: "Cheese Masters",
      rating: 4.5,
      inStock: true,
      description: "Premium cheese slices"
    },
    {
      id: 6,
      name: "Lassi",
      price: 40,
      unit: "250ml",
      image: "/api/placeholder/300/200",
      seller: "Traditional Dairy",
      rating: 4.3,
      inStock: true,
      description: "Sweet traditional lassi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-25 to-blue-100">
      <Header />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
              <Milk className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dairy Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fresh milk, cheese, yogurt and other dairy products from local dairy farms
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dairyProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow group">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!product.inStock && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    Out of Stock
                  </Badge>
                )}
                {product.inStock && (
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    In Stock
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-sm text-gray-500">by {product.seller}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-green-600">{formatBDTaka(product.price)}</span>
                    <span className="text-gray-500 ml-1">/{product.unit}</span>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={!product.inStock}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}