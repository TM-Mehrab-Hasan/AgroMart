# 🌾 AgroMart

A comprehensive agricultural marketplace platform that connects farmers, fishermen, and dairy producers directly with customers through an efficient multi-role management system.

## 🎯 Project Overview

AgroMart is designed to help villages, communities, and agricultural areas manage multiple types of farming operations through a unified marketplace platform. It serves as a central hub where agricultural producers can sell their products either directly or through shop owners, with efficient delivery systems.

## 🎭 User Roles

### Category-Specific Roles
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

- [x] Project initialization
- [ ] UI framework setup (Tailwind + Shadcn/ui)
- [ ] Database schema design
- [ ] Authentication system
- [ ] User role management
- [ ] Product catalog system
- [ ] Shopping cart functionality
- [ ] Order management
- [ ] Payment integration
- [ ] Delivery system
- [ ] Admin dashboard
- [ ] Mobile responsiveness

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mehrab Hasan**
- GitHub: [@TM-Mehrab-Hasan](https://github.com/TM-Mehrab-Hasan)

---

**Built with ❤️ for the agricultural community** 🌾
