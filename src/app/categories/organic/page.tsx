"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft, ShoppingCart, Star, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatBDTaka } from "@/lib/api/landing";

export default function OrganicPage() {
  const organicProducts = [
    {
      id: 1,
      name: "Organic Spinach",
      price: 45,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Eco Green Farm",
      rating: 4.8,
      inStock: true,
      description: "Certified organic fresh spinach",
      certified: true
    },
    {
      id: 2,
      name: "Organic Tomatoes",
      price: 80,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Pure Harvest",
      rating: 4.7,
      inStock: true,
      description: "Organic vine-ripened tomatoes",
      certified: true
    },
    {
      id: 3,
      name: "Organic Carrots",
      price: 65,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Nature&apos;s Best",
      rating: 4.6,
      inStock: true,
      description: "Fresh organic carrots",
      certified: true
    },
    {
      id: 4,
      name: "Organic Honey",
      price: 450,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Bee Natural",
      rating: 4.9,
      inStock: false,
      description: "Pure organic wildflower honey",
      certified: true
    },
    {
      id: 5,
      name: "Organic Eggs",
      price: 120,
      unit: "dozen",
      image: "/api/placeholder/300/200",
      seller: "Free Range Farm",
      rating: 4.8,
      inStock: true,
      description: "Organic free-range chicken eggs",
      certified: true
    },
    {
      id: 6,
      name: "Organic Milk",
      price: 85,
      unit: "liter",
      image: "/api/placeholder/300/200",
      seller: "Organic Dairy Co.",
      rating: 4.7,
      inStock: true,
      description: "Fresh organic cow milk",
      certified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-green-100">
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
            <div className="w-20 h-20 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
              <Leaf className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Certified Organic</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium certified organic products grown without chemicals or pesticides
          </p>
          <div className="flex justify-center mt-4">
            <Badge className="bg-green-600 text-white px-4 py-2 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              100% Certified Organic
            </Badge>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organicProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow group border-green-200">
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
                {product.certified && (
                  <Badge className="absolute top-2 left-2 bg-emerald-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Certified
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