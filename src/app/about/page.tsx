"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Target, 
  Eye, 
  Users,
  Award,
  Globe,
  Leaf,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Calendar,
  Building,
  Truck,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "1000+", label: "Partner Farmers", icon: Leaf },
    { number: "50+", label: "Cities Served", icon: Globe },
    { number: "99.5%", label: "Customer Satisfaction", icon: Award }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above everything else"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Promoting sustainable farming practices for a better environment"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Every product is quality-checked to ensure freshness and safety"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong community of farmers, customers, and partners"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Using technology to revolutionize the agricultural marketplace"
    },
    {
      icon: CheckCircle,
      title: "Transparency",
      description: "Open and honest communication in all our business practices"
    }
  ];

  const team = [
    {
      name: "Mehrab Hasan",
      role: "Founder & CEO",
      description: "Passionate about connecting farmers with consumers through technology",
      image: "/api/placeholder/150/150",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "mehrab@agromart.com"
      }
    },
    {
      name: "Sarah Ahmed",
      role: "COO",
      description: "Expert in operations and supply chain management",
      image: "/api/placeholder/150/150",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@agromart.com"
      }
    },
    {
      name: "Rahman Khan",
      role: "CTO",
      description: "Technology leader with 10+ years in e-commerce platforms",
      image: "/api/placeholder/150/150",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "rahman@agromart.com"
      }
    },
    {
      name: "Fatima Sultana",
      role: "Head of Marketing",
      description: "Digital marketing expert focused on agricultural sector",
      image: "/api/placeholder/150/150",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "fatima@agromart.com"
      }
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "AgroMart Founded",
      description: "Started with a vision to connect farmers directly with consumers"
    },
    {
      year: "2024",
      title: "Platform Launch",
      description: "Launched our digital marketplace with 100+ farmers and 1000+ customers"
    },
    {
      year: "2024",
      title: "Major Expansion",
      description: "Expanded to 25+ cities across Bangladesh with 500+ farmers"
    },
    {
      year: "2025",
      title: "National Coverage",
      description: "Achieved nationwide coverage with 1000+ farmers and 50K+ customers"
    }
  ];

  const services = [
    {
      icon: Globe,
      title: "Online Marketplace",
      description: "Digital platform connecting farmers, customers, and retailers"
    },
    {
      icon: Truck,
      title: "Logistics & Delivery",
      description: "Efficient delivery network ensuring fresh products reach customers"
    },
    {
      icon: UserCheck,
      title: "Quality Verification",
      description: "Rigorous quality checks and farmer verification processes"
    },
    {
      icon: TrendingUp,
      title: "Business Analytics",
      description: "Data-driven insights for farmers and retailers to grow their business"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-green-100">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 text-lg px-6 py-2">
              🌾 About AgroMart
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Revolutionizing
              <span className="block text-yellow-300">Agricultural Trade</span>
            </h1>
            <p className="text-xl lg:text-2xl text-green-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              We are Bangladesh's leading agricultural marketplace, connecting farmers directly with consumers 
              to ensure fresh, quality products reach every household while empowering farmers economically.
            </p>
            
            <div className="flex gap-6 justify-center flex-wrap mb-12">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-6 text-lg font-semibold" asChild>
                <Link href="/products">
                  Explore Products
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-6 text-lg font-semibold" asChild>
                <Link href="/for-sellers">
                  Join as Farmer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600">
              Growing together with Bangladesh's agricultural community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <Card className="border-0 shadow-xl text-center">
              <CardHeader className="p-8">
                <div className="w-20 h-20 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Our Mission</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  To create a transparent, efficient, and farmer-friendly agricultural marketplace that bridges 
                  the gap between producers and consumers, ensuring fair prices for farmers and fresh products for customers.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Vision */}
            <Card className="border-0 shadow-xl text-center">
              <CardHeader className="p-8">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Our Vision</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  To become Bangladesh's most trusted agricultural platform, empowering every farmer with digital tools 
                  and market access while ensuring food security and sustainable agriculture across the nation.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Story */}
            <Card className="border-0 shadow-xl text-center">
              <CardHeader className="p-8">
                <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Our Story</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Born from witnessing farmers struggle with middlemen and price volatility, AgroMart was founded 
                  to create direct connections between farmers and consumers, ensuring fair trade and fresh products.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Values */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader className="text-center p-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg mb-3">{value.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions for the agricultural ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to transform agriculture
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <Badge className="bg-green-100 text-green-800">
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-3">{milestone.title}</CardTitle>
                        <CardDescription className="leading-relaxed">
                          {milestone.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals working to revolutionize agriculture in Bangladesh
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                <CardHeader className="p-6">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <CardTitle className="text-lg mb-1">{member.name}</CardTitle>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {member.description}
                  </CardDescription>
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Have questions or want to learn more about AgroMart? We'd love to hear from you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">+880-1234-567890</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-600">contact@agromart.com</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Office</h3>
                <p className="text-gray-600">Dhaka, Bangladesh</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
                <Link href="/products">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg" asChild>
                <Link href="/for-sellers">
                  Become a Seller
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