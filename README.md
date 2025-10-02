# 🌾 AgroMart - Agricultural Marketplace

A comprehensive full-stack agricultural marketplace built with Next.js 15, TypeScript, and modern web technologies. AgroMart connects farmers, sellers, shop owners, and customers in a unified digital ecosystem for agricultural products.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.16.3-green?style=for-the-badge&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-dev-lightblue?style=for-the-badge&logo=sqlite)

## ✨ Features

### 🛍️ **Core Marketplace**
- **Multi-category Products**: 8 categories (Crops, Vegetables, Fruits, Dairy, Fish, Meat, Grains)
- **Advanced Search & Filtering**: Location-based, price range, organic certification
- **Shop Management**: Multi-shop support with location-based discovery
- **Order Management**: Complete lifecycle from cart to delivery
- **Review & Rating System**: Product and shop reviews with moderation

### 👥 **User Management**
- **5 User Roles**: Admin, Customer, Shop Owner, Seller, Rider
- **Role-based Access Control**: Secure permission system
- **Profile Management**: Comprehensive user profiles
- **Address Management**: Multiple delivery addresses

### 🛒 **E-commerce Features**
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout Process**: Streamlined ordering with coupon support
- **Payment Integration**: Stripe-ready payment system
- **Order Tracking**: Real-time order status updates

### 🔔 **Communication**
- **Notification System**: Real-time notifications for order updates
- **Email Integration**: Automated email notifications
- **In-app Messaging**: Notification center with preferences

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Next.js 15.5.4** with Turbopack for fast development
- **React 19** with modern hooks and patterns
- **TypeScript** for type safety
- **Tailwind CSS 4** for responsive design
- **Radix UI** for accessible components
- **Redux Toolkit** for state management

### **Backend Stack**
- **Next.js API Routes** with RESTful architecture
- **Prisma ORM** for database management
- **NextAuth.js** for authentication
- **bcryptjs** for password hashing
- **SQLite** (development) / **PostgreSQL** (production)

### **Database Schema**
15+ interconnected models including:
- Users, Products, Shops, Orders
- Reviews, Cart, Addresses, Notifications
- Coupons, Analytics, Authentication tables

## 🔌 API Documentation

### **40+ REST Endpoints**

#### **Products** (`/api/products/`)
```
GET    /api/products              # List products with filtering
POST   /api/products              # Create product (Seller/Shop Owner)
GET    /api/products/featured     # Featured products
GET    /api/products/search       # Advanced search
GET    /api/products/[id]         # Product details
PUT    /api/products/[id]         # Update product
DELETE /api/products/[id]         # Delete product
```

#### **Shops** (`/api/shops/`)
```
GET    /api/shops                 # List shops
POST   /api/shops                 # Create shop (Shop Owner)
GET    /api/shops/[id]            # Shop details
PUT    /api/shops/[id]            # Update shop
GET    /api/shops/[id]/products   # Shop products
```

#### **Orders** (`/api/orders/`)
```
GET    /api/orders                # List orders (role-based)
POST   /api/orders                # Create order
GET    /api/orders/[id]           # Order details
PUT    /api/orders/[id]           # Update order status
```

#### **Users** (`/api/users/`)
```
GET    /api/users                 # List users (Admin)
GET    /api/users/profile         # Current user profile
PUT    /api/users/profile         # Update profile
GET    /api/users/[id]            # User details
PUT    /api/users/[id]            # Update user (Admin)
```

[View complete API documentation →](docs/API_DOCUMENTATION.md)

## 🧪 Testing Infrastructure

### **Comprehensive Testing Suite**
- **API Testing Class**: 350+ lines of automated testing
- **Smoke Tests**: Quick health checks for CI/CD
- **PowerShell Scripts**: Windows-compatible testing
- **Postman Collection**: Complete API documentation
- **Manual Testing Checklist**: 500+ lines of testing procedures

### **Testing Commands**
```bash
npm run test:smoke    # Quick smoke tests
npm run test:api      # Comprehensive API tests
npm run test:dev      # Test + dev server
npm run postbuild     # Post-build validation
```

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

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

### **Environment Variables**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: External services
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
```

## 📁 Project Structure

```
agromart/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (40+ endpoints)
│   │   ├── auth/             # Authentication pages
│   │   └── (dashboard)/      # Protected dashboard routes
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities and configurations
│   ├── store/                # Redux store and slices
│   └── types/                # TypeScript type definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── scripts/                  # Testing and utility scripts
├── docs/                     # Documentation
└── postman/                  # API collection
```

## 🔒 Security Features

- **Authentication**: NextAuth.js with JWT tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive request validation
- **CSRF Protection**: Built-in Next.js protection
- **Password Security**: bcryptjs hashing
- **SQL Injection Prevention**: Prisma ORM protection

## 📊 Performance Features

- **Next.js 15 with Turbopack**: Fast development and builds
- **Image Optimization**: Next.js automatic optimization
- **API Route Optimization**: Efficient database queries
- **Caching Strategies**: Response caching and memoization
- **Pagination**: Efficient data loading
- **Search Optimization**: Indexed database queries

## 🌐 Deployment

### **Development**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
```

### **Database Commands**
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### **Production Deployment**
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to Vercel/Netlify/Railway
5. Configure domain and SSL

## 📈 Analytics & Monitoring

- **Order Analytics**: Revenue tracking and insights
- **User Analytics**: Registration and engagement metrics
- **Product Analytics**: View counts and popularity
- **Performance Monitoring**: API response times
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

- [Project Summary](PROJECT_SUMMARY.md) - Complete project overview
- [Testing Documentation](TESTING_DOCUMENTATION.md) - Testing infrastructure guide
- [API Testing Checklist](docs/API_TESTING_CHECKLIST.md) - Manual testing procedures
- [Postman Collection](postman/AgroMart-API-Collection.json) - API collection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mehrab Hasan**
- GitHub: [@TM-Mehrab-Hasan](https://github.com/TM-Mehrab-Hasan)
- LinkedIn: [Mehrab Hasan](https://linkedin.com/in/tm-mehrab-hasan)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://prisma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- UI components by [Radix UI](https://radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for the agricultural community** 🌾

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TM-Mehrab-Hasan/AgroMart)
```
- **👥 Customers** - People who buy agricultural products
- **🏪 Shop Owners** - Intermediaries who buy from farmers and resell with their own pricing
- **🚜 Sellers/Producers** - Farmers, fishermen, dairy farmers, etc.

### Global Roles
- **👨‍💼 Admin** - Oversees the entire platform across all categories
- **🏍️ Rider** - Delivery personnel who handle orders based on coverage areas

## 🌱 Agricultural Categories

- **🌾 Crops** - Grain, rice, wheat, etc.
- **🥕 Vegetables** - Fresh produce
- **🥛 Dairy** - Milk, cheese, yogurt, etc.
- **🐟 Fish** - Fresh fish and seafood
- **📦 More categories** - Expandable for future needs

## ✨ Key Features

- 🛒 **Multi-category marketplace** with unified interface
- 👤 **Role-based authentication** system
- 📦 **Inventory management** for tracking products
- 💰 **Flexible pricing** - Direct sales or through shop owners
- 🎫 **Discount & coupon** system
- 🚚 **Area-based delivery** system
- 💳 **Multiple payment gateways**
- 📱 **Responsive design** for all devices

## 🛠️ Tech Stack

### Frontend & Backend
- **⚡ Next.js 15+** - Full-stack React framework with App Router
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 Shadcn/ui** - High-quality UI components

### Database & Authentication
- **🐘 PostgreSQL** - Robust relational database
- **🔐 NextAuth.js** - Secure authentication with role management

### State Management & Storage
- **🔄 Redux Toolkit** - Predictable state management
- **📂 Local Storage** - Image storage (expandable to cloud)

### Payment Integration
- **💳 Stripe** - International payments
- **📱 Local Mobile Banking** - Nagad, bKash, Rocket
- **🏦 Bank Transfers** - Traditional banking
- **💵 Cash on Delivery** - With additional charges

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TM-Mehrab-Hasan/AgroMart.git
   cd AgroMart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
agromart/
├── src/
│   ├── app/              # App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and configurations
│   ├── store/            # Redux store and slices
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── prisma/              # Database schema and migrations
```

## 🔧 Development Roadmap

- [Testing Documentation](TESTING_DOCUMENTATION.md) - Testing infrastructure guide
- [API Testing Checklist](docs/API_TESTING_CHECKLIST.md) - Manual testing procedures
- [Postman Collection](postman/AgroMart-API-Collection.json) - API collection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mehrab Hasan**
- GitHub: [@TM-Mehrab-Hasan](https://github.com/TM-Mehrab-Hasan)
- LinkedIn: [Mehrab Hasan](https://linkedin.com/in/tm-mehrab-hasan)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://prisma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- UI components by [Radix UI](https://radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for the agricultural community** 🌾

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TM-Mehrab-Hasan/AgroMart)

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mehrab Hasan**
- Portfolio: [TM-Mehrab-Hasan](https://tm-mehrab-hasan.github.io/)

---

**Built with ❤️ for the agricultural community** 🌾
