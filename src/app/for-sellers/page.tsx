"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  User,
  Truck,
  Award,
  Star,
  Heart,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function ForSellersPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Your Income",
      description: "Sell directly to customers and earn up to 40% more than traditional channels",
      highlight: "40% More Profit"
    },
    {
      icon: Users,
      title: "Reach More Customers",
      description: "Access thousands of customers across Bangladesh through our platform",
      highlight: "10K+ Customers"
    },
    {
      icon: Globe,
      title: "Expand Your Market",
      description: "Sell beyond your local area and reach customers in multiple cities",
      highlight: "50+ Cities"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Get guaranteed payments with our secure payment processing system",
      highlight: "100% Secure"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track your sales, understand customer behavior, and grow your business",
      highlight: "Real-time Data"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Focus on farming while we handle marketing, payments, and delivery coordination",
      highlight: "More Time"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Register Your Account",
      description: "Sign up with your basic information and verify your phone number",
      icon: User
    },
    {
      step: "02",
      title: "Complete Your Profile",
      description: "Add your farm details, products, and upload quality photos",
      icon: CheckCircle
    },
    {
      step: "03",
      title: "Get Verified",
      description: "Our team will verify your profile and products for quality assurance",
      icon: Shield
    },
    {
      step: "04",
      title: "Start Selling",
      description: "List your products and start receiving orders from customers",
      icon: TrendingUp
    }
  ];

  const testimonials = [
    {
      name: "Rahman Miah",
      location: "Rangpur",
      farmType: "Rice Farmer",
      income: "৳45,000/month",
      rating: 5,
      comment: "AgroMart helped me sell my rice directly to customers. My income increased by 40% in just 3 months!",
      beforeIncome: "৳32,000",
      afterIncome: "৳45,000"
    },
    {
      name: "Fatima Begum",
      location: "Bogura",
      farmType: "Dairy Farmer",
      income: "৳38,000/month",
      rating: 5,
      comment: "Selling fresh milk and dairy products online was never this easy. Great support from the team!",
      beforeIncome: "৳25,000",
      afterIncome: "৳38,000"
    },
    {
      name: "Abdul Karim",
      location: "Cox's Bazar",
      farmType: "Fish Farmer",
      income: "৳52,000/month",
      rating: 5,
      comment: "The platform helped me reach customers in Dhaka and Chittagong. My business has grown tremendously!",
      beforeIncome: "৳35,000",
      afterIncome: "৳52,000"
    }
  ];

  const requirements = [
    "Valid Bangladeshi citizenship or legal residency",
    "Own or lease agricultural land/farm",
    "Ability to produce quality agricultural products",
    "Mobile phone for communication and updates",
    "Basic understanding of online selling (training provided)"
  ];

  const supportFeatures = [
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Get help anytime through phone, chat, or WhatsApp"
    },
    {
      icon: Award,
      title: "Training Program",
      description: "Free training on digital marketing and online selling"
    },
    {
      icon: Truck,
      title: "Logistics Support",
      description: "We handle delivery coordination and customer communication"
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Detailed reports to help you understand and grow your business"
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
              🌾 Join 500+ Successful Farmers
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Grow Your Farm
              <span className="block text-yellow-300">Business Online</span>
            </h1>
            <p className="text-xl lg:text-2xl text-green-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Join AgroMart and sell your agricultural products directly to thousands of customers. 
              Increase your income, expand your reach, and grow your business with Bangladesh's #1 agricultural marketplace.
            </p>
            
            <div className="flex gap-6 justify-center flex-wrap mb-12">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-6 text-lg font-semibold" asChild>
                <Link href="/auth/signup?role=seller">
                  Start Selling Now
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-6 text-lg font-semibold">
                <Phone className="mr-2 h-5 w-5" />
                Call: +880-1234-567890
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { number: "500+", label: "Active Farmers" },
                { number: "৳40K+", label: "Avg. Monthly Income" },
                { number: "10K+", label: "Happy Customers" },
                { number: "50+", label: "Cities Reached" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-300 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-green-100 text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose AgroMart?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed in digital agriculture marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardHeader className="text-center p-8">
                  <div className="mx-auto mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <benefit.icon className="h-10 w-10 text-green-600" />
                    </div>
                  </div>
                  <Badge className="mb-4 bg-green-100 text-green-800">
                    {benefit.highlight}
                  </Badge>
                  <CardTitle className="text-xl mb-3 group-hover:text-green-600 transition-colors duration-300">
                    {benefit.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Getting Started is Easy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to start selling your products online
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-300 -translate-x-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
              <Link href="/auth/signup?role=seller">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real farmers sharing their success with AgroMart
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-xl mb-2">{testimonial.name}</CardTitle>
                  <div className="text-sm text-gray-500 mb-4">
                    {testimonial.farmType} • {testimonial.location}
                  </div>
                  
                  {/* Income Comparison */}
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Before:</span>
                      <span className="text-sm font-medium text-gray-700">{testimonial.beforeIncome}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">After:</span>
                      <span className="text-lg font-bold text-green-600">{testimonial.afterIncome}</span>
                    </div>
                    <Badge className="w-full bg-green-600 text-white">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Current Monthly Income
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  <p className="text-gray-600 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Who Can Join?
              </h2>
              <p className="text-xl text-gray-600">
                Simple requirements to get started
              </p>
            </div>
            
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center p-8">
                <CardTitle className="text-2xl mb-4">Eligibility Requirements</CardTitle>
                <CardDescription className="text-lg">
                  Make sure you meet these basic requirements before applying
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-lg">{requirement}</p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-gray-600 mb-6">
                    Don't worry if you're new to online selling - we provide full training and support!
                  </p>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg" asChild>
                    <Link href="/auth/signup?role=seller">
                      Apply Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              We Support Your Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our dedicated team helps you every step of the way
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl lg:text-2xl text-green-100 mb-8 leading-relaxed">
              Join thousands of successful farmers who trust AgroMart for their online business growth.
            </p>
            
            <div className="flex gap-6 justify-center flex-wrap mb-12">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-6 text-lg font-semibold" asChild>
                <Link href="/auth/signup?role=seller">
                  Start Selling Today
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-6 text-lg font-semibold">
                <Phone className="mr-2 h-5 w-5" />
                Call: +880-1234-567890
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-green-100 flex-wrap">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>support@agromart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Available across Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}