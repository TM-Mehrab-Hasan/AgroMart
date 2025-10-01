# 🗄️ AgroMart Database Schema Documentation

## Overview
The AgroMart database is designed to support a comprehensive agricultural marketplace with multiple user roles, product management, order processing, and delivery systems.

## Database Architecture

### Core Entities

#### 👥 Users & Authentication
- **User**: Core user entity with role-based access control
- **Account**: OAuth provider accounts (NextAuth.js)
- **Session**: User sessions
- **VerificationToken**: Email/phone verification tokens

#### 🏪 Marketplace Structure
- **Shop**: Store entities owned by shop owners
- **Product**: Agricultural products with categorization
- **Address**: User and shop addresses
- **DeliveryArea**: Geographical delivery zones

#### 🛒 Order Management
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within orders
- **Review**: Product, shop, and rider reviews

#### 🚚 Delivery System
- **RiderProfile**: Delivery rider information and capabilities
- **DeliveryArea**: Service areas with pricing and timing

#### 🎯 Business Features
- **Coupon**: Discount codes and promotions
- **Notification**: User notifications system
- **Analytics**: Business intelligence and reporting

## User Roles

### 1. 👨‍💼 Admin
- Platform oversight and management
- User verification and moderation
- System analytics and reporting
- Content management

### 2. 🛒 Customer
- Browse and purchase products
- Manage orders and addresses
- Rate and review products/services
- Receive notifications

### 3. 🏪 Shop Owner
- Manage shop profile and products
- Set pricing and commission rates
- Handle orders from multiple farmers
- Business analytics

### 4. 🚜 Seller/Producer
- List agricultural products
- Manage inventory and pricing
- Fulfill orders directly or through shops
- Track sales performance

### 5. 🏍️ Rider
- Manage delivery profile and areas
- Accept and fulfill delivery requests
- Track delivery performance
- Location-based order assignment

## Product Categories

### 🌾 Crops
- Grains (rice, wheat, corn)
- Pulses and legumes
- Seeds and cereals

### 🥕 Vegetables
- Fresh produce
- Seasonal vegetables
- Organic options

### 🥛 Dairy
- Milk and milk products
- Cheese and yogurt
- Fresh dairy items

### 🐟 Fish
- Fresh water fish
- Sea fish
- Seafood products

## Key Features

### 📦 Product Management
- Multi-category product catalog
- Stock quantity tracking
- Organic certification
- Harvest and expiry date tracking
- Image gallery support
- Minimum order quantities

### 🛒 Order Processing
- Shopping cart functionality
- Multiple payment methods
- Cash on delivery with fees
- Order status tracking
- Delivery scheduling

### 💳 Payment Integration
- Cash on delivery (COD)
- Mobile banking (bKash, Nagad, Rocket)
- Bank transfers
- Stripe for international payments
- Coupon and discount system

### 🚚 Delivery System
- Area-based delivery zones
- Rider assignment and tracking
- Delivery fee calculation
- Estimated delivery times
- Real-time location tracking

### 📊 Analytics & Reporting
- Sales analytics by category
- User engagement metrics
- Order fulfillment tracking
- Revenue reporting
- Top products and sellers

## Database Relationships

### User Relationships
```
User (1) → (M) Product (Seller)
User (1) → (M) Shop (Owner)
User (1) → (M) Order (Customer)
User (1) → (1) RiderProfile
User (1) → (M) Address
User (1) → (M) Review
```

### Product Relationships
```
Product (M) → (1) User (Seller)
Product (M) → (1) Shop (Optional)
Product (1) → (M) OrderItem
Product (1) → (M) Review
```

### Order Relationships
```
Order (1) → (M) OrderItem
Order (M) → (1) User (Customer)
Order (M) → (1) User (Rider, Optional)
Order (M) → (1) Address (Delivery)
Order (1) → (M) Review
```

## Indexes and Performance

### Primary Indexes
- All `id` fields use CUID for unique identification
- Email uniqueness on User table
- Order number uniqueness
- Coupon code uniqueness

### Recommended Indexes
```sql
-- Product search optimization
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_product_status ON products(status);
CREATE INDEX idx_product_seller ON products(seller_id);

-- Order processing optimization
CREATE INDEX idx_order_customer ON orders(customer_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created ON orders(created_at);

-- User role queries
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_user_active ON users(is_active);
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agromart_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateways
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

# File Storage
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## Development Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Reset database
npm run db:reset

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Sample Data

The seed file creates:
- 7 users across all roles
- 1 sample shop
- 8 products across all categories
- 2 promotional coupons
- 1 delivery area
- 1 rider profile
- Initial analytics data

This provides a complete foundation for testing and development of the AgroMart platform.