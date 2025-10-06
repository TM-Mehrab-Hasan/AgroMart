# 🌾 AgroMart - Agricultural Marketplace

A comprehensive full-stack agricultural marketplace built with Next.js 15, TypeScript, and modern web technologies. AgroMart connects farmers, sellers, shop owners, and customers in a unified digital ecosystem for agricultural products.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.16.3-green?style=for-the-badge&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-dev-lightblue?style=for-the-badge&logo=sqlite)

## ✨ Recent Updates (October 2025)

### 🚀 **New Features**
- **Dynamic Data Integration**: Complete migration from static to dynamic database-driven content
- **BD Taka Currency Support**: Native Bangladesh Taka (৳) formatting throughout the application
- **Enhanced UI/UX**: Modern gradient designs with greenish-white backgrounds
- **Role-Based Authentication**: Secure admin access with public registration controls
- **Responsive Design**: Compressed, mobile-optimized layouts

### 🛠️ **Technical Improvements**
- **Custom Tabs Component**: Eliminated external dependencies for better performance
- **Header Navigation**: Fixed category links and improved dropdown design
- **Import Resolution**: Resolved all compilation issues with custom UI components
- **API Integration**: Complete backend with Express.js and landing page endpoints
- **Database Seeding**: Pre-populated with realistic agricultural products and users

## 🛍️ **Core Features**

### **Multi-Role Platform**
- **👥 Customers** - Browse and purchase agricultural products
- **🚜 Farmers/Producers** - Sell directly to customers or shops
- **🏪 Shop Owners** - Buy from farmers and resell with markup
- **🏍️ Delivery Riders** - Handle order deliveries based on coverage areas
- **👨‍💼 Administrators** - Platform management and oversight

### **Product Categories**
- **🌾 Crops** - Rice, wheat, grains, pulses
- **🥕 Vegetables** - Fresh produce, leafy greens
- **🍎 Fruits** - Seasonal and exotic fruits
- **🥛 Dairy** - Milk, cheese, yogurt, butter
- **🐟 Fish** - Fresh fish and seafood
- **🥩 Meat** - Poultry, beef, goat meat
- **🌰 Grains** - Various grain products
- **🌿 Organic** - Certified organic products

### **E-commerce Features**
- **Shopping Cart**: Persistent cart with quantity management
- **Order Management**: Complete lifecycle from cart to delivery
- **Payment Integration**: Multiple payment methods including BD mobile banking
- **Review System**: Product and seller ratings
- **Search & Filter**: Advanced product discovery
- **Location-Based**: Area-specific product availability

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Next.js 15.5.4** with App Router and Turbopack
- **React 19** with modern hooks and patterns
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **Custom UI Components** (eliminated external dependencies)
- **Lucide React** for beautiful icons

### **Backend Stack**
- **Express.js 4.18.2** API server
- **Prisma ORM** for database management
- **SQLite** (development) / **PostgreSQL** (production ready)
- **bcryptjs** for secure password hashing
- **CORS enabled** for cross-origin requests

### **Database Schema**
15+ interconnected models including:
- Users (5 role types), Products, Categories, Orders
- Shopping Cart, Reviews, Addresses
- Notifications, Coupons, Analytics

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**
```bash
# Clone the repository
git clone https://github.com/TM-Mehrab-Hasan/AgroMart.git
cd AgroMart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Seed database with sample data
npm run db:seed

# Start development servers
npm run dev        # Frontend (port 3000)
npm run api        # Backend API (port 5000)
```

### **Environment Variables**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
API_BASE_URL="http://localhost:5000"

# Optional: External services
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
```

## 🔌 API Endpoints

### **Landing Page API** (`http://localhost:5000`)
```
GET    /health                        # API health check
GET    /api/landing/all              # All landing page data
GET    /api/landing/featured-products # Featured products
GET    /api/landing/categories       # Product categories
GET    /api/landing/testimonials     # User testimonials
GET    /api/landing/stats            # Platform statistics
```

### **Core Features**
- **Real-time Data**: Dynamic content from database
- **BD Taka Formatting**: Native ৳ currency support
- **Role-based Access**: Secure authentication system
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Gradient backgrounds and animations

## 📁 Project Structure

```
agromart/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   ├── auth/             # Authentication pages
│   │   │   ├── signin/       # Role-based signin (5 roles)
│   │   │   └── signup/       # Public registration (4 roles)
│   │   └── (dashboard)/      # Protected dashboard routes
│   ├── components/
│   │   ├── ui/               # Custom UI components
│   │   │   └── tabs.tsx      # Custom tabs component
│   │   └── common/           # Shared components
│   │       └── Header.tsx    # Enhanced navigation header
│   ├── lib/                  # Utilities and configurations
│   │   └── utils.ts          # BD Taka formatting utilities
│   └── types/                # TypeScript definitions
├── api/                      # Express.js backend
│   ├── server.js             # Main server file
│   └── controllers/          # API controllers
│       └── LandingController.ts
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
└── database/
    └── dev.db                # SQLite database
```

## 🎨 UI/UX Features

### **Design System**
- **Color Scheme**: Green-based agricultural theme
- **Typography**: Modern, readable fonts
- **Animations**: Smooth hover effects and transitions
- **Responsiveness**: Mobile-first responsive design
- **Accessibility**: ARIA compliant components

### **Key Components**
- **Enhanced Header**: Gradient backgrounds with category dropdown
- **Role Cards**: Beautiful authentication role selection
- **Product Cards**: Modern product display with BD Taka pricing
- **Custom Tabs**: Performance-optimized tab component
- **Responsive Layout**: Compressed, space-efficient designs

## 🔒 Security & Authentication

- **Role-Based Access**: 5 distinct user roles with appropriate permissions
- **Secure Admin Access**: Admin signin available, public admin registration blocked
- **Password Security**: bcryptjs hashing with salt rounds
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for secure cross-origin requests

## 💱 Currency & Localization

- **BD Taka Integration**: Native Bangladesh Taka (৳) support
- **formatBDTaka() Function**: Consistent currency formatting
- **Local Context**: Designed for Bangladesh agricultural market
- **Regional Products**: Local agricultural product categories

## 🧪 Testing & Quality

### **Comprehensive Testing**
- **API Testing**: Express.js endpoint validation
- **Frontend Testing**: Component and integration tests
- **Database Testing**: Prisma schema validation
- **Cross-browser**: Modern browser compatibility

### **Development Tools**
```bash
npm run dev          # Development with hot reload
npm run build        # Production build
npm run start        # Production server
npm run db:studio    # Prisma database browser
npm run db:reset     # Reset database
```

## 🌐 Deployment Ready

### **Production Deployment**
- **Frontend**: Vercel/Netlify ready
- **Backend**: Railway/Heroku ready
- **Database**: PostgreSQL production ready
- **Environment**: Production configuration included

### **Performance Optimizations**
- **Next.js 15**: Latest performance improvements
- **Image Optimization**: Automatic Next.js optimization
- **API Caching**: Efficient database queries
- **Bundle Optimization**: Tree shaking and code splitting

## 📊 Database Overview

### **Pre-seeded Data**
- **8 Products**: Across all categories with realistic pricing
- **7 Users**: Including admin account (admin@agromart.com)
- **Categories**: Complete agricultural product categories
- **Sample Data**: Ready-to-use development data

### **Admin Access**
- **Email**: admin@agromart.com
- **Role**: Administrator
- **Access**: Full platform management capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

- [API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference
- [Database Schema](docs/DATABASE_SCHEMA.md) - Database structure
- [Development Guide](docs/DEVELOPMENT.md) - Setup and development guide

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mehrab Hasan**
- GitHub: [@TM-Mehrab-Hasan](https://github.com/TM-Mehrab-Hasan)
- LinkedIn: [Mehrab Hasan](https://linkedin.com/in/tm-mehrab-hasan)
- Portfolio: [TM-Mehrab-Hasan](https://tm-mehrab-hasan.github.io/)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://prisma.io/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)
- Backend powered by [Express.js](https://expressjs.com/)

---

**Built with ❤️ for the agricultural community of Bangladesh** 🇧🇩 🌾

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TM-Mehrab-Hasan/AgroMart)
