# AgroMart API Testing Checklist

## 🎯 Testing Overview
This document provides a comprehensive testing checklist for all AgroMart API endpoints. Each endpoint should be tested for functionality, authentication, authorization, validation, and error handling.

## 🔧 Prerequisites

### Test Environment Setup
- [ ] Database seeded with test data
- [ ] Environment variables configured
- [ ] Test users created for each role
- [ ] Postman/Insomnia collection imported

### Test Users Required
```
ADMIN: admin@agromart.com / admin123
CUSTOMER: customer@agromart.com / customer123  
SELLER: seller@agromart.com / seller123
SHOP_OWNER: shopowner@agromart.com / shopowner123
RIDER: rider@agromart.com / rider123
```

## 🔐 Authentication Testing

### Auth Endpoints
- [ ] `POST /api/auth/register` - User registration
  - [ ] Valid registration data ✅
  - [ ] Duplicate email validation ❌
  - [ ] Missing required fields ❌
  - [ ] Invalid email format ❌
  - [ ] Weak password validation ❌

- [ ] `POST /api/auth/signin` - User login
  - [ ] Valid credentials ✅
  - [ ] Invalid email ❌
  - [ ] Invalid password ❌
  - [ ] Non-existent user ❌

### Session Validation
- [ ] Protected routes require authentication
- [ ] Invalid tokens rejected
- [ ] Expired tokens handled properly
- [ ] Role-based access control working

## 📦 Product API Testing

### Core Product Operations
- [ ] `GET /api/products` - List products
  - [ ] Basic listing ✅
  - [ ] Pagination works ✅
  - [ ] Category filtering ✅
  - [ ] Price range filtering ✅
  - [ ] Seller filtering ✅
  - [ ] Stock availability filtering ✅

- [ ] `POST /api/products` - Create product
  - [ ] Seller can create ✅
  - [ ] Customer cannot create ❌
  - [ ] Required fields validation ❌
  - [ ] Price validation ❌
  - [ ] Stock quantity validation ❌

- [ ] `GET /api/products/[id]` - Get product details
  - [ ] Valid product ID ✅
  - [ ] Invalid product ID ❌
  - [ ] Includes related data ✅

- [ ] `PUT /api/products/[id]` - Update product
  - [ ] Owner can update ✅
  - [ ] Non-owner cannot update ❌
  - [ ] Admin can update ✅
  - [ ] Partial updates work ✅

- [ ] `DELETE /api/products/[id]` - Delete product
  - [ ] Owner can delete ✅
  - [ ] Non-owner cannot delete ❌
  - [ ] Admin can delete ✅

### Specialized Product Endpoints
- [ ] `GET /api/products/featured` - Featured products
- [ ] `GET /api/products/search?q=` - Product search
- [ ] `GET /api/products/categories` - Product categories

## 🛒 Cart API Testing

- [ ] `GET /api/cart` - Get user cart
  - [ ] Authenticated user ✅
  - [ ] Unauthenticated user ❌
  - [ ] Empty cart handling ✅
  - [ ] Cart calculations correct ✅

- [ ] `POST /api/cart` - Add to cart
  - [ ] Valid product and quantity ✅
  - [ ] Invalid product ID ❌
  - [ ] Zero/negative quantity ❌
  - [ ] Stock availability check ✅

- [ ] `PUT /api/cart/[itemId]` - Update cart item
  - [ ] Valid quantity update ✅
  - [ ] Remove item (quantity = 0) ✅
  - [ ] Stock validation ✅

- [ ] `DELETE /api/cart/[itemId]` - Remove cart item
- [ ] `DELETE /api/cart/clear` - Clear entire cart

## 📋 Order API Testing

### Order Operations
- [ ] `GET /api/orders` - List orders
  - [ ] Customer sees own orders ✅
  - [ ] Seller sees relevant orders ✅
  - [ ] Admin sees all orders ✅
  - [ ] Pagination works ✅
  - [ ] Status filtering ✅

- [ ] `POST /api/orders` - Create order
  - [ ] Valid order data ✅
  - [ ] Empty cart ❌
  - [ ] Invalid address ❌
  - [ ] Stock validation ✅
  - [ ] Price calculations ✅

- [ ] `GET /api/orders/[id]` - Get order details
  - [ ] Order owner access ✅
  - [ ] Seller access ✅
  - [ ] Admin access ✅
  - [ ] Unauthorized access ❌

- [ ] `PUT /api/orders/[id]` - Update order status
  - [ ] Valid status transitions ✅
  - [ ] Invalid status transitions ❌
  - [ ] Role-based permissions ✅

- [ ] `DELETE /api/orders/[id]` - Cancel order
  - [ ] Customer can cancel pending ✅
  - [ ] Cannot cancel shipped ❌

## 🏪 Shop API Testing

- [ ] `GET /api/shops` - List shops
- [ ] `POST /api/shops` - Create shop
- [ ] `GET /api/shops/[id]` - Shop details
- [ ] `PUT /api/shops/[id]` - Update shop
- [ ] `DELETE /api/shops/[id]` - Delete shop
- [ ] `GET /api/shops/[id]/products` - Shop products
- [ ] `POST /api/shops/[id]/products` - Add product to shop

## 📍 Address API Testing

- [ ] `GET /api/addresses` - List user addresses
- [ ] `POST /api/addresses` - Create address
- [ ] `GET /api/addresses/[id]` - Address details
- [ ] `PUT /api/addresses/[id]` - Update address
- [ ] `DELETE /api/addresses/[id]` - Delete address
- [ ] `PUT /api/addresses/[id]/default` - Set default address

## 🔔 Notification API Testing

- [ ] `GET /api/notifications` - List notifications
- [ ] `POST /api/notifications` - Create notification (admin)
- [ ] `GET /api/notifications/[id]` - Notification details
- [ ] `PUT /api/notifications/[id]` - Mark as read/unread
- [ ] `DELETE /api/notifications/[id]` - Delete notification
- [ ] `PUT /api/notifications/mark-all-read` - Mark all as read
- [ ] `DELETE /api/notifications/clear-all` - Clear all
- [ ] `GET /api/notifications/unread-count` - Unread count
- [ ] `GET /api/notifications/preferences` - Get preferences
- [ ] `PUT /api/notifications/preferences` - Update preferences

## ⭐ Review API Testing

### Core Review Operations
- [ ] `GET /api/reviews` - List reviews
- [ ] `POST /api/reviews` - Create review
- [ ] `GET /api/reviews/[id]` - Review details
- [ ] `PUT /api/reviews/[id]` - Update review
- [ ] `DELETE /api/reviews/[id]` - Delete review

### Specialized Review Endpoints
- [ ] `GET /api/reviews/analytics` - Review analytics
- [ ] `GET /api/reviews/products/[productId]` - Product reviews
- [ ] `GET /api/reviews/shops/[shopId]` - Shop reviews
- [ ] `GET /api/reviews/moderation` - Admin moderation
- [ ] `POST /api/reviews/moderation` - Bulk actions

## 👥 User API Testing

- [ ] `GET /api/users` - List users (admin)
- [ ] `POST /api/users` - Create user (admin)
- [ ] `GET /api/users/profile` - User profile
- [ ] `PUT /api/users/profile` - Update profile
- [ ] `GET /api/users/[id]` - User details
- [ ] `PUT /api/users/[id]` - Update user
- [ ] `DELETE /api/users/[id]` - Delete user

## 🔍 Error Handling Testing

### HTTP Status Codes
- [ ] 200 OK - Successful requests
- [ ] 201 Created - Resource creation
- [ ] 400 Bad Request - Invalid input
- [ ] 401 Unauthorized - Missing authentication
- [ ] 403 Forbidden - Insufficient permissions
- [ ] 404 Not Found - Resource not found
- [ ] 422 Unprocessable Entity - Validation errors
- [ ] 500 Internal Server Error - Server errors

### Error Response Format
```json
{
  "message": "Error description",
  "errors": ["Specific validation errors"],
  "statusCode": 400
}
```

## 🚀 Performance Testing

- [ ] Response times under 500ms for most endpoints
- [ ] Pagination handles large datasets efficiently
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Proper indexing on filtered fields

## 🔒 Security Testing

- [ ] SQL injection protection
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Rate limiting (if implemented)
- [ ] Sensitive data not exposed in responses
- [ ] Proper password hashing

## 📊 Test Results Template

```
Endpoint: POST /api/products
Method: POST
Expected Status: 201
Actual Status: 201
Response Time: 245ms
Authentication: Seller
Test Data: Valid product data
Result: ✅ PASS
Notes: Product created successfully with correct calculations
```

## 🎯 Testing Checklist Summary

### Critical Path Testing
1. [ ] User registration and authentication
2. [ ] Product creation and listing
3. [ ] Add to cart functionality
4. [ ] Order creation process
5. [ ] Order status updates
6. [ ] Review system
7. [ ] Admin user management

### Role-Based Access Testing
- [ ] Admin access to all resources
- [ ] Customer access to own resources
- [ ] Seller access to own products/orders
- [ ] Shop Owner access to shop resources
- [ ] Rider access to delivery orders

### Data Integrity Testing
- [ ] Referential integrity maintained
- [ ] Cascade deletions work correctly
- [ ] Transaction rollbacks on errors
- [ ] Concurrent access handling

## 📝 Test Execution Log

Date: ___________
Tester: ___________
Environment: ___________
Database State: ___________

### Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Success Rate: ___%

### Critical Issues Found
1. ___________
2. ___________
3. ___________

### Recommendations
1. ___________
2. ___________
3. ___________