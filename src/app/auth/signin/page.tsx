"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wheat, 
  Mail, 
  Lock, 
  Chrome, 
  Users, 
  Tractor, 
  ShoppingCart, 
  Store, 
  Truck, 
  Shield,
  ArrowRight
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        Signin: "Try signing with a different account.",
        OAuthSignin: "Try signing with a different account.",
        OAuthCallback: "Try signing with a different account.",
        OAuthCreateAccount: "Try signing with a different account.",
        EmailCreateAccount: "Try signing with a different account.",
        Callback: "Try signing with a different account.",
        OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "Check your email address.",
        CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
        default: "Unable to sign in.",
      };
      setError(errorMessages[errorParam] || errorMessages.default);
    }
  }, [errorParam]);

  const roles = [
    {
      type: "SELLER",
      name: "Farmer/Producer",
      description: "Sell crops and produce directly",
      icon: Tractor,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      path: "/auth/signin/farmer"
    },
    {
      type: "CUSTOMER",
      name: "Customer",
      description: "Buy fresh agricultural products",
      icon: ShoppingCart,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      path: "/auth/signin/customer"
    },
    {
      type: "SHOP_OWNER",
      name: "Shop Owner",
      description: "Resell with custom pricing",
      icon: Store,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      path: "/auth/signin/shop-owner"
    },
    {
      type: "RIDER",
      name: "Delivery Rider",
      description: "Deliver orders efficiently",
      icon: Truck,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      path: "/auth/signin/rider"
    },
    {
      type: "ADMIN",
      name: "Administrator",
      description: "Oversee platform operations",
      icon: Shield,
      color: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
      path: "/auth/signin/admin"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Get the session to check user role and redirect accordingly
        const session = await getSession();
        if (session?.user?.role) {
          // Redirect based on user role
          const roleRedirects = {
            ADMIN: "/dashboard/admin",
            CUSTOMER: "/dashboard/customer",
            SHOP_OWNER: "/dashboard/shop-owner",
            SELLER: "/dashboard/seller",
            RIDER: "/dashboard/rider",
          };
          const redirectTo = roleRedirects[session.user.role] || callbackUrl;
          router.push(redirectTo);
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-25 to-green-100 px-4 py-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-green-300/40 rounded-full blur-lg animate-bounce"></div>
        
        <Card className="w-full max-w-4xl backdrop-blur-sm bg-white/90 shadow-2xl border-0 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-emerald-100/20 rounded-lg"></div>
          <CardHeader className="text-center relative z-10 pb-6">
            <Link href="/" className="flex items-center justify-center gap-3 mb-4 hover:scale-105 transition-transform duration-300">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Wheat className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                AgroMart
              </span>
            </Link>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Choose Your Role
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-xl mx-auto">
              Select how you want to use AgroMart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roles.map((role, index) => (
                <div key={index} className="group">
                  <Card 
                    className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-white to-green-50/50 h-full"
                    onClick={() => router.push(role.path)}
                  >
                    <CardHeader className="text-center pb-4 pt-4">
                      <div className={`w-16 h-16 rounded-xl ${role.color} ${role.hoverColor} mx-auto mb-3 flex items-center justify-center group-hover:rotate-3 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                        <role.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold group-hover:text-green-600 transition-colors duration-300 mb-1">
                        {role.name}
                      </CardTitle>
                      <CardDescription className="group-hover:text-gray-700 transition-colors duration-300 text-sm leading-snug">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <div className="px-4 pb-4">
                      <Button 
                        className={`w-full ${role.color} ${role.hoverColor} text-white font-medium py-2 group-hover:shadow-md transition-all duration-300 text-sm`}
                        size="sm"
                      >
                        Sign In
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4 pt-4 border-t border-green-200">
              <div className="space-y-2">
                <p className="text-gray-600">Or continue with traditional login</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRole("traditional")}
                  className="hover:bg-green-50 hover:border-green-400 border-2 px-6 py-2 font-medium transition-all duration-300"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Use Email & Password
                </Button>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-700 font-medium mb-1">Don&apos;t have an account?</p>
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300"
                >
                  Create Account Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-25 to-green-100 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-green-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl animate-pulse delay-1500"></div>
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-2xl border-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-lg"></div>
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Wheat className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">AgroMart</span>
          </Link>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedRole(null)}
            className="mt-2"
          >
            ← Choose different role
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link 
              href="/auth/signup" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign up
            </Link>
          </div>

          <div className="text-center text-sm">
            <Link 
              href="/auth/forgot-password" 
              className="text-gray-500 hover:text-gray-700"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}