"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wheat, ArrowLeft, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatBDTaka } from "@/lib/api/landing";

export default function GrainsPage() {
  const grainsProducts = [
    {
      id: 1,
      name: "Brown Rice",
      price: 140,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Healthy Grains Co.",
      rating: 4.7,
      inStock: true,
      description: "Nutritious brown rice with fiber"
    },
    {
      id: 2,
      name: "Lentils (Masoor)",
      price: 85,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Pulse Paradise",
      rating: 4.5,
      inStock: true,
      description: "Red lentils, protein rich"
    },
    {
      id: 3,
      name: "Chickpeas",
      price: 95,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Golden Harvest",
      rating: 4.6,
      inStock: true,
      description: "Premium quality chickpeas"
    },
    {
      id: 4,
      name: "Black Beans",
      price: 120,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Protein Plus",
      rating: 4.4,
      inStock: false,
      description: "Organic black beans"
    },
    {
      id: 5,
      name: "Millet",
      price: 110,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Ancient Grains",
      rating: 4.8,
      inStock: true,
      description: "Nutritious millet grains"
    },
    {
      id: 6,
      name: "Quinoa Seeds",
      price: 280,
      unit: "kg",
      image: "/api/placeholder/300/200",
      seller: "Super Foods",
      rating: 4.9,
      inStock: true,
      description: "Premium quinoa seeds, superfood"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-100">
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
            <div className="w-20 h-20 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
              <Wheat className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Grains & Pulses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover various grain products, pulses, and legumes for healthy cooking and nutrition
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grainsProducts.map((product) => (
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