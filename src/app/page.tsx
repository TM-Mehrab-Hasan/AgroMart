"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { 
  Wheat, 
  Fish, 
  Milk, 
  Carrot, 
  ShoppingCart, 
  Users, 
  Truck, 
  Shield,
  Search,
  Star,
  MapPin,
  Clock,
  Leaf,
  TrendingUp,
  Award,
  Heart,
  ArrowRight,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import { getUserRoleDisplayName } from "@/lib/auth/permissions";
import { fetchLandingData, formatBDTaka, type LandingData } from "@/lib/api/landing";

export default function Home() {
  const { data: session } = useSession();
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLandingData() {
      try {
        const data = await fetchLandingData();
        setLandingData(data);
      } catch (error) {
        console.error('Failed to load landing data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLandingData();
  }, []);

  // Use dynamic data or fallbacks
  const stats = landingData?.stats || [];
  const categories = landingData?.categories || [];
  const featuredProducts = landingData?.featuredProducts || [];
  const testimonials = landingData?.testimonials?.testimonials || [];

  const categoryIcons = {
    "Crops": Wheat,
    "Vegetables": Carrot,
    "Dairy": Milk,
    "Fish": Fish
  };

  const features = [
    { 
      icon: Leaf, 
      title: "Farm Fresh", 
      description: "Direct from farmers to your doorstep",
      highlight: "100% Fresh"
    },
    { 
      icon: Truck, 
      title: "Fast Delivery", 
      description: "Same day delivery in most areas",
      highlight: "Within 24hrs"
    },
    { 
      icon: Shield, 
      title: "Quality Assured", 
      description: "Every product is quality checked",
      highlight: "Verified"
    },
    { 
      icon: Award, 
      title: "Best Prices", 
      description: "No middleman, better prices",
      highlight: "30% Savings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-green-100">
      <Header />

      {/* Hero Section - Modern with search */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-25 to-green-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                {session?.user ? (
                  <div className="mb-8">
                    <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 text-sm px-3 py-1">
                      Welcome back, {getUserRoleDisplayName(session.user.role)}! 🌾
                    </Badge>
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                      Welcome back,
                      <span className="text-green-600 block">{session.user.name}!</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Continue exploring fresh agricultural products and manage your {session.user.role.toLowerCase()} activities.
                    </p>
                  </div>
                ) : (
                  <div className="mb-8">
                    <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 text-sm px-4 py-2">
                      🌾 #1 Agricultural Marketplace
                    </Badge>
                    <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                      Fresh from
                      <span className="text-green-600 block">Farm to Table</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                      Connect directly with local farmers and get the freshest agricultural products delivered to your doorstep.
                    </p>
                  </div>
                )}

                {/* Search Bar */}
                {!session?.user && (
                  <div className="mb-8">
                    <div className="flex max-w-lg">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input 
                          placeholder="Search for vegetables, fruits, dairy..." 
                          className="pl-12 pr-4 py-6 text-lg border-2 border-green-200 focus:border-green-500 rounded-l-xl rounded-r-none"
                        />
                      </div>
                      <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-6 rounded-r-xl rounded-l-none">
                        Search
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Popular searches: Organic vegetables, Fresh milk, Local honey
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap">
                  {session?.user ? (
                    <>
                      {session.user.role === "CUSTOMER" && (
                        <>
                          <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
                            <Link href="/products">
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              Browse Products
                            </Link>
                          </Button>
                          <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg" asChild>
                            <Link href="/dashboard/customer">My Dashboard</Link>
                          </Button>
                        </>
                      )}
                      {(session.user.role === "SELLER" || session.user.role === "SHOP_OWNER") && (
                        <>
                          <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
                            <Link href={session.user.role === "SELLER" ? "/dashboard/seller" : "/dashboard/shop-owner"}>
                              Manage Products
                            </Link>
                          </Button>
                          <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg" asChild>
                            <Link href="/analytics">View Analytics</Link>
                          </Button>
                        </>
                      )}
                      {session.user.role === "RIDER" && (
                        <>
                          <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
                            <Link href="/dashboard/rider">Available Orders</Link>
                          </Button>
                          <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg" asChild>
                            <Link href="/dashboard/rider">My Earnings</Link>
                          </Button>
                        </>
                      )}
                      {session.user.role === "ADMIN" && (
                        <>
                          <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
                            <Link href="/dashboard/admin">Admin Dashboard</Link>
                          </Button>
                          <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg" asChild>
                            <Link href="/dashboard/admin">Platform Analytics</Link>
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
                        <Link href="/auth/signup">
                          Start Shopping
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg" asChild>
                        <Link href="/products">
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Explore Products
                        </Link>
                      </Button>
                    </>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span>Free delivery over ৳500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Quality guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Hero Image/Video */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wheat className="h-12 w-12 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Fresh Agricultural Products</h3>
                      <p className="text-gray-600">Connecting you with local farmers</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">4.8 Rating</p>
                      <p className="text-xs text-gray-500">From 10K+ customers</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">24hr Delivery</p>
                      <p className="text-xs text-gray-500">Same day in most areas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {loading ? "Loading..." : stat.number}
                </div>
                <div className="text-gray-600 text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover fresh, quality products from local farmers across different categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Wheat;
            return (
              <Link href={category.href} key={index}>
                <Card className="hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group border-0 shadow-lg">
                  <CardHeader className="text-center p-8">
                    <div className="mx-auto mb-6">
                      <div className={`w-20 h-20 rounded-2xl ${category.color} flex items-center justify-center group-hover:animate-bounce transition-all duration-300 shadow-lg`}>
                        <IconComponent className="h-10 w-10 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-green-600 transition-colors duration-300 mb-2">{category.name}</CardTitle>
                    <CardDescription className="group-hover:text-gray-700 transition-colors duration-300 mb-3">{category.description}</CardDescription>
                    <Badge variant="outline" className="mx-auto">
                      {loading ? "Loading..." : category.count}
                    </Badge>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the freshest and most popular products from our local farmers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <Card key={product.id} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                  <CardHeader className="p-0">
                    <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-t-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/300/200';
                          }}
                        />
                      ) : (
                        <div className="text-green-600">
                          {product.category === 'CROPS' && <Wheat className="h-16 w-16" />}
                          {product.category === 'VEGETABLES' && <Carrot className="h-16 w-16" />}
                          {product.category === 'DAIRY' && <Milk className="h-16 w-16" />}
                          {product.category === 'FISH' && <Fish className="h-16 w-16" />}
                        </div>
                      )}
                      {product.isOrganic && (
                        <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                          Organic
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-500">({product.reviewCount})</span>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="text-sm mb-4 line-clamp-2">{product.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          {formatBDTaka(product.price)}
                        </span>
                        <span className="text-sm text-gray-500">/{product.unit}</span>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      By {product.seller.name} • {product.location || 'Bangladesh'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {featuredProducts.length > 4 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/products">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section - Enhanced */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AgroMart?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re revolutionizing how fresh agricultural products reach your table
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="h-10 w-10 text-green-600" />
                </div>
                <Badge className="mb-3 bg-green-100 text-green-800 hover:bg-green-200">
                  {feature.highlight}
                </Badge>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers and farmers across Bangladesh
            </p>
            {landingData?.testimonials && (
              <div className="mt-4 text-sm text-gray-500">
                Based on {landingData.testimonials.totalReviews || 0} reviews • Average rating: {landingData.testimonials.averageRating.toFixed(1)}★
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">
                    &quot;{testimonial.comment}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{testimonial.role}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section - Enhanced */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you&apos;re a farmer, customer, shop owner, rider, or admin, AgroMart has a place for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { 
                role: "Farmers", 
                description: "Sell crops and produce directly", 
                color: "bg-green-500",
                hoverColor: "hover:bg-green-600",
                loginPath: "/auth/signin/farmer",
                benefits: "Higher profits, direct sales"
              },
              { 
                role: "Customers", 
                description: "Buy fresh agricultural products", 
                color: "bg-blue-500",
                hoverColor: "hover:bg-blue-600",
                loginPath: "/auth/signin/customer",
                benefits: "Fresh products, best prices"
              },
              { 
                role: "Shop Owners", 
                description: "Resell with custom pricing", 
                color: "bg-purple-500",
                hoverColor: "hover:bg-purple-600",
                loginPath: "/auth/signin/shop-owner",
                benefits: "Multiple locations, analytics"
              },
              { 
                role: "Riders", 
                description: "Deliver orders efficiently", 
                color: "bg-orange-500",
                hoverColor: "hover:bg-orange-600",
                loginPath: "/auth/signin/rider",
                benefits: "Flexible hours, good earnings"
              },
              { 
                role: "Admin", 
                description: "Oversee platform operations", 
                color: "bg-gray-600",
                hoverColor: "hover:bg-gray-700",
                loginPath: "/auth/signin/admin",
                benefits: "Full platform control"
              }
            ].map((user, index) => (
              <Link href={user.loginPath} key={index}>
                <Card className="text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border-0 shadow-lg">
                  <CardHeader className="p-8">
                    <div className={`w-16 h-16 rounded-2xl ${user.color} ${user.hoverColor} mx-auto mb-4 flex items-center justify-center group-hover:animate-pulse transition-all duration-300 shadow-lg`}>
                      <Users className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors duration-300 mb-2">{user.role}</CardTitle>
                    <CardDescription className="group-hover:text-gray-700 transition-colors duration-300 mb-4">{user.description}</CardDescription>
                    <Badge variant="outline" className="mb-4 text-xs">
                      {user.benefits}
                    </Badge>
                    <Button 
                      size="sm" 
                      className={`w-full ${user.color} ${user.hoverColor} text-white group-hover:shadow-md transition-all duration-300`}
                    >
                      Join as {user.role === "Shop Owners" ? "Shop Owner" : user.role.slice(0, -1)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6 text-lg">New to AgroMart?</p>
            <Button variant="outline" size="lg" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg" asChild>
              <Link href="/auth/signup">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Farm-to-Table Experience?
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Join thousands of farmers and customers who trust AgroMart for fresh, quality agricultural products.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold" asChild>
                <Link href="/auth/signup">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold" asChild>
                <Link href="/products">
                  Explore Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
