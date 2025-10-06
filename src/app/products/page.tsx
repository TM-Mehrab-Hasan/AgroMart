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

  // Comprehensive product data with all 8 categories
  const products = [
    // Crops
    {
      id: 1,
      name: "Premium Basmati Rice",
      category: "Crops",
      price: 120,
      unit: "kg",
      seller: "Green Valley Farm",
      rating: 4.5,
      reviews: 23,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "High-quality aromatic basmati rice from local farms"
    },
    {
      id: 2,
      name: "Golden Wheat",
      category: "Crops",
      price: 85,
      unit: "kg",
      seller: "Golden Grains",
      rating: 4.2,
      reviews: 31,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Fresh wheat grains perfect for flour production"
    },
    // Vegetables
    {
      id: 3,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      price: 60,
      unit: "kg",
      seller: "Organic Gardens",
      rating: 4.4,
      reviews: 18,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Ripe, juicy tomatoes grown without pesticides"
    },
    {
      id: 4,
      name: "Organic Carrots",
      category: "Vegetables",
      price: 70,
      unit: "kg",
      seller: "Leafy Greens Farm",
      rating: 4.6,
      reviews: 27,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Sweet, crunchy carrots grown organically"
    },
    // Fruits
    {
      id: 5,
      name: "Fresh Mangoes",
      category: "Fruits",
      price: 180,
      unit: "kg",
      seller: "Tropical Fruits Co.",
      rating: 4.7,
      reviews: 35,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Sweet Himsagar mangoes from Chapainawabganj"
    },
    {
      id: 6,
      name: "Organic Bananas",
      category: "Fruits",
      price: 60,
      unit: "dozen",
      seller: "Fresh Fruit Farm",
      rating: 4.3,
      reviews: 22,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Naturally ripened organic bananas"
    },
    {
      id: 7,
      name: "Local Oranges",
      category: "Fruits",
      price: 120,
      unit: "kg",
      seller: "Citrus Valley",
      rating: 4.5,
      reviews: 19,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Juicy sweet oranges from Sylhet hills"
    },
    // Dairy
    {
      id: 8,
      name: "Fresh Cow Milk",
      category: "Dairy",
      price: 80,
      unit: "liter",
      seller: "Dairy Fresh Farm",
      rating: 4.8,
      reviews: 45,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Pure, fresh milk from grass-fed cows"
    },
    {
      id: 9,
      name: "Homemade Yogurt",
      category: "Dairy",
      price: 120,
      unit: "kg",
      seller: "Healthy Dairy Co.",
      rating: 4.6,
      reviews: 19,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Creamy, probiotic-rich yogurt made from fresh milk"
    },
    // Fish
    {
      id: 10,
      name: "Fresh Rohu Fish",
      category: "Fish",
      price: 350,
      unit: "kg",
      seller: "River Fresh",
      rating: 4.4,
      reviews: 28,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Freshly caught Rohu fish from local rivers"
    },
    {
      id: 11,
      name: "Hilsa Fish",
      category: "Fish",
      price: 800,
      unit: "kg",
      seller: "Ocean Fresh",
      rating: 4.9,
      reviews: 12,
      inStock: false,
      image: "/api/placeholder/300/200",
      description: "Premium quality Hilsa fish, the king of Bengali fish"
    },
    // Meat
    {
      id: 12,
      name: "Fresh Chicken",
      category: "Meat",
      price: 280,
      unit: "kg",
      seller: "Halal Meat Co.",
      rating: 4.5,
      reviews: 33,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Farm-raised halal chicken, antibiotic-free"
    },
    {
      id: 13,
      name: "Goat Meat",
      category: "Meat",
      price: 850,
      unit: "kg",
      seller: "Fresh Meat Farm",
      rating: 4.7,
      reviews: 15,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Fresh goat meat from local farms"
    },
    {
      id: 14,
      name: "Beef (Premium Cut)",
      category: "Meat",
      price: 650,
      unit: "kg",
      seller: "Premium Meats",
      rating: 4.6,
      reviews: 21,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Premium quality beef from grass-fed cattle"
    },
    // Grains
    {
      id: 15,
      name: "Red Lentils (Masoor)",
      category: "Grains",
      price: 85,
      unit: "kg",
      seller: "Pulse Paradise",
      rating: 4.3,
      reviews: 26,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "High-protein red lentils for healthy cooking"
    },
    {
      id: 16,
      name: "Chickpeas (Chola)",
      category: "Grains",
      price: 95,
      unit: "kg",
      seller: "Grain Masters",
      rating: 4.4,
      reviews: 18,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Premium quality chickpeas rich in protein"
    },
    {
      id: 17,
      name: "Black Beans",
      category: "Grains",
      price: 120,
      unit: "kg",
      seller: "Healthy Grains",
      rating: 4.5,
      reviews: 14,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Organic black beans perfect for healthy meals"
    },
    // Organic
    {
      id: 18,
      name: "Organic Spinach",
      category: "Organic",
      price: 45,
      unit: "kg",
      seller: "Certified Organic Farm",
      rating: 4.8,
      reviews: 32,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Certified organic fresh spinach leaves"
    },
    {
      id: 19,
      name: "Organic Honey",
      category: "Organic",
      price: 450,
      unit: "kg",
      seller: "Pure Honey Co.",
      rating: 4.9,
      reviews: 41,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Pure organic wildflower honey, unprocessed"
    },
    {
      id: 20,
      name: "Organic Brown Rice",
      category: "Organic",
      price: 140,
      unit: "kg",
      seller: "Organic Valley",
      rating: 4.6,
      reviews: 25,
      inStock: true,
      image: "/api/placeholder/300/200",
      description: "Certified organic brown rice with natural fiber"
    }
  ];

  const categories = ["all", "Crops", "Vegetables", "Fruits", "Dairy", "Fish", "Meat", "Grains", "Organic"];

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