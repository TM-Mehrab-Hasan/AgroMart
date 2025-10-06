"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Apple, ArrowLeft, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatBDTaka } from "@/lib/api/landing";

export default function FruitsPage() {
  const fruitsProducts = [
    {
      id: 1,
      name: "Fresh Mangoes",
      price: 180,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Tropical Orchards",
      rating: 4.8,
      inStock: true,
      description: "Sweet Himsagar mangoes from Chapainawabganj"
    },
    {
      id: 2,
      name: "Organic Bananas",
      price: 60,
      unit: "dozen",
      image: "/api/placeholder/300/200",
      seller: "Green Valley Farm",
      rating: 4.5,
      inStock: true,
      description: "Organic ripe bananas"
    },
    {
      id: 3,
      name: "Fresh Apples",
      price: 220,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Mountain Fresh",
      rating: 4.6,
      inStock: true,
      description: "Imported fresh red apples"
    },
    {
      id: 4,
      name: "Guavas",
      price: 80,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Local Groves",
      rating: 4.3,
      inStock: true,
      description: "Sweet local guavas"
    },
    {
      id: 5,
      name: "Pomegranates",
      price: 350,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Premium Fruits",
      rating: 4.7,
      inStock: false,
      description: "Fresh pomegranates rich in antioxidants"
    },
    {
      id: 6,
      name: "Oranges",
      price: 120,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Citrus Gardens",
      rating: 4.4,
      inStock: true,
      description: "Juicy sweet oranges"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-25 to-red-100">
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
            <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center">
              <Apple className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Fresh Fruits</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover seasonal and exotic fruits sourced directly from local orchards and farms
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fruitsProducts.map((product) => (
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