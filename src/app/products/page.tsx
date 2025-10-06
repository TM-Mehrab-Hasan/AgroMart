"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star,
  Grid3X3,
  List,
  SlidersHorizontal
} from "lucide-react";
import Image from "next/image";
import { formatBDTaka } from "@/lib/api/landing";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  // Dummy product data
  const products = [
    {
      id: 1,
      name: "Organic Rice",
      category: "Crops",
      price: 120,
      unit: "kg",
      seller: "Green Valley Farm",
      rating: 4.5,
      reviews: 23,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Premium organic basmati rice, naturally grown without chemicals"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      price: 60,
      unit: "kg",
      seller: "Organic Gardens",
      rating: 4.4,
      reviews: 18,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Juicy red tomatoes, perfect for cooking and salads"
    },
    {
      id: 3,
      name: "Fresh Milk",
      category: "Dairy",
      price: 60,
      unit: "liter",
      seller: "Dairy Fresh Farm",
      rating: 4.8,
      reviews: 45,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Pure cow milk, daily fresh from local dairy farm"
    },
    {
      id: 4,
      name: "Salmon Fish",
      category: "Fish",
      price: 800,
      unit: "kg",
      seller: "Ocean Fresh",
      rating: 4.9,
      reviews: 12,
      inStock: false,
      image: "/api/placeholder/300/200",
      description: "Premium Atlantic salmon, fresh catch of the day"
    },
    {
      id: 5,
      name: "Wheat Flour",
      category: "Crops",
      price: 45,
      unit: "kg",
      seller: "Golden Grains",
      rating: 4.2,
      reviews: 31,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Fresh ground wheat flour, perfect for baking"
    },
    {
      id: 6,
      name: "Green Spinach",
      category: "Vegetables",
      price: 40,
      unit: "bunch",
      seller: "Leafy Greens Farm",
      rating: 4.6,
      reviews: 27,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Fresh spinach leaves, rich in iron and vitamins"
    },
    {
      id: 7,
      name: "Greek Yogurt",
      category: "Dairy",
      price: 120,
      unit: "500g",
      seller: "Healthy Dairy Co.",
      rating: 4.6,
      reviews: 19,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Thick creamy Greek yogurt, high in protein"
    },
    {
      id: 8,
      name: "Prawns",
      category: "Fish",
      price: 1200,
      unit: "kg",
      seller: "Coastal Seafood",
      rating: 4.8,
      reviews: 8,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Large fresh prawns, perfect for special occasions"
    }
  ];

  const categories = ["all", "Crops", "Vegetables", "Dairy", "Fish"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-green-100">
      <Header />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Fresh Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover fresh agricultural products directly from local farmers and producers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products or sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {sortedProducts.map((product) => (
            <Card key={product.id} className={`hover:shadow-lg transition-shadow group ${
              viewMode === "list" ? "flex flex-row" : ""
            }`}>
              <div className={`relative overflow-hidden ${
                viewMode === "list" ? "w-48 h-32" : "w-full h-48"
              } rounded-t-lg ${viewMode === "list" ? "rounded-l-lg rounded-t-none" : ""}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
              
              <div className={viewMode === "list" ? "flex-1" : ""}>
                <CardHeader className={viewMode === "list" ? "pb-2" : ""}>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <p className="text-sm text-gray-500">by {product.seller}</p>
                  <Badge variant="outline" className="w-fit">{product.category}</Badge>
                </CardHeader>
                
                <CardContent className={viewMode === "list" ? "pt-0" : ""}>
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
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}