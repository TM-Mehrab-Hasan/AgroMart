// API utility functions for landing page data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface LandingStat {
  number: string;
  label: string;
}

export interface LandingCategory {
  name: string;
  description: string;
  href: string;
  count: string;
  color: string;
}

export interface LandingProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  images: string[];
  seller: {
    id: string;
    name: string;
    image?: string;
  };
  shop?: {
    id: string;
    name: string;
  };
  rating: number;
  reviewCount: number;
  isOrganic: boolean;
  location?: string;
}

export interface LandingTestimonial {
  name: string;
  role: string;
  comment: string;
  rating: number;
  location: string;
}

export interface LandingData {
  stats: LandingStat[];
  categories: LandingCategory[];
  featuredProducts: LandingProduct[];
  testimonials: {
    testimonials: LandingTestimonial[];
    totalReviews: number;
    averageRating: number;
  };
}

// Fetch all landing page data in one request
export async function fetchLandingData(): Promise<LandingData> {
  try {
    const response = await fetch(`${API_BASE_URL}/landing/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch landing data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching landing data:', error);
    // Return fallback data in case of error
    return getFallbackLandingData();
  }
}

// Fetch individual data sections (for future use)
export async function fetchLandingStats(): Promise<LandingStat[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/landing/stats`);
    const result = await response.json();
    return result.success ? result.data.stats : [];
  } catch (error) {
    console.error('Error fetching landing stats:', error);
    return [];
  }
}

export async function fetchLandingCategories(): Promise<LandingCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/landing/categories`);
    const result = await response.json();
    return result.success ? result.data.categories : [];
  } catch (error) {
    console.error('Error fetching landing categories:', error);
    return [];
  }
}

export async function fetchFeaturedProducts(): Promise<LandingProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/landing/featured-products`);
    const result = await response.json();
    return result.success ? result.data.products : [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Utility function to format BD Taka currency
export function formatBDTaka(amount: number): string {
  // Format the number with proper separators and add the correct Taka symbol
  const formattedNumber = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `৳${formattedNumber}`;
}

// Fallback data in case API fails
function getFallbackLandingData(): LandingData {
  return {
    stats: [
      { number: "10K+", label: "Happy Customers" },
      { number: "500+", label: "Local Farmers" },
      { number: "50+", label: "Cities Served" },
      { number: "4.8★", label: "Average Rating" }
    ],
    categories: [
      { 
        name: "Crops", 
        description: "Rice, wheat, grains", 
        color: "bg-amber-100 text-amber-800", 
        href: "/categories/crops", 
        count: "Loading..." 
      },
      { 
        name: "Vegetables", 
        description: "Fresh produce", 
        color: "bg-green-100 text-green-800", 
        href: "/categories/vegetables", 
        count: "Loading..." 
      },
      { 
        name: "Dairy", 
        description: "Milk, cheese, yogurt", 
        color: "bg-blue-100 text-blue-800", 
        href: "/categories/dairy", 
        count: "Loading..." 
      },
      { 
        name: "Fish", 
        description: "Fresh fish & seafood", 
        color: "bg-cyan-100 text-cyan-800", 
        href: "/categories/fish", 
        count: "Loading..." 
      }
    ],
    featuredProducts: [],
    testimonials: {
      testimonials: [
        {
          name: "Sarah Johnson",
          role: "Customer",
          comment: "Fresh vegetables delivered to my door. The quality is amazing!",
          rating: 5,
          location: "Dhaka"
        },
        {
          name: "Rahman Miah",
          role: "Farmer",
          comment: "Increased my income by 40% selling directly to customers.",
          rating: 5,
          location: "Rangpur"
        },
        {
          name: "Hasan Ali",
          role: "Shop Owner",
          comment: "Perfect platform for managing multiple suppliers efficiently.",
          rating: 5,
          location: "Chittagong"
        }
      ],
      totalReviews: 0,
      averageRating: 4.8
    }
  };
}