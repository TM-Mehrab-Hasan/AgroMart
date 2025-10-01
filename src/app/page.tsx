import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Wheat, Fish, Milk, Carrot, ShoppingCart, Users, Truck, Shield } from "lucide-react";

export default function Home() {
  const categories = [
    { icon: Wheat, name: "Crops", description: "Rice, wheat, grains", color: "bg-amber-100 text-amber-800" },
    { icon: Carrot, name: "Vegetables", description: "Fresh produce", color: "bg-green-100 text-green-800" },
    { icon: Milk, name: "Dairy", description: "Milk, cheese, yogurt", color: "bg-blue-100 text-blue-800" },
    { icon: Fish, name: "Fish", description: "Fresh fish & seafood", color: "bg-cyan-100 text-cyan-800" }
  ];

  const features = [
    { icon: ShoppingCart, title: "Multi-Category Marketplace", description: "All agricultural products in one place" },
    { icon: Users, title: "Role-Based System", description: "Farmers, customers, shop owners, riders, admin" },
    { icon: Truck, title: "Efficient Delivery", description: "Area-based delivery system" },
    { icon: Shield, title: "Secure Payments", description: "Multiple payment gateways supported" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
            🌾 Agricultural Marketplace Platform
          </Badge>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Connecting Farmers to
            <span className="text-green-600"> Markets</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive platform that connects farmers, fishermen, and dairy producers 
            directly with customers through efficient marketplace management.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Selling
            </Button>
            <Button size="lg" variant="outline">
              Browse Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Agricultural Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Who Can Use AgroMart?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { role: "Farmers", description: "Sell crops and produce directly", color: "bg-green-500" },
            { role: "Customers", description: "Buy fresh agricultural products", color: "bg-blue-500" },
            { role: "Shop Owners", description: "Resell with custom pricing", color: "bg-purple-500" },
            { role: "Riders", description: "Deliver orders efficiently", color: "bg-orange-500" },
            { role: "Admin", description: "Oversee platform operations", color: "bg-gray-600" }
          ].map((user, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${user.color} mx-auto mb-3 flex items-center justify-center`}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{user.role}</CardTitle>
                <CardDescription>{user.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
