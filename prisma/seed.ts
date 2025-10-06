import { PrismaClient, UserRole, ProductCategory, ProductUnit, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AgroMart database seed...');

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agromart.com' },
    update: {},
    create: {
      email: 'admin@agromart.com',
      name: 'AgroMart Admin',
      phone: '+880-1234-567890',
      role: UserRole.ADMIN,
      phoneVerified: true,
      emailVerified: new Date(),
    },
  });

  // Create Customer Users
  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      email: 'customer1@example.com',
      name: 'John Smith',
      phone: '+880-1111-111111',
      role: UserRole.CUSTOMER,
      phoneVerified: true,
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      name: 'Sarah Johnson',
      phone: '+880-2222-222222',
      role: UserRole.CUSTOMER,
      phoneVerified: true,
    },
  });

  // Create Farmer/Sellers
  const farmer1 = await prisma.user.upsert({
    where: { email: 'farmer1@example.com' },
    update: {},
    create: {
      email: 'farmer1@example.com',
      name: 'Rahman Miah',
      phone: '+880-3333-333333',
      role: UserRole.SELLER,
      phoneVerified: true,
    },
  });

  const farmer2 = await prisma.user.upsert({
    where: { email: 'fisherman1@example.com' },
    update: {},
    create: {
      email: 'fisherman1@example.com',
      name: 'Abdul Karim',
      phone: '+880-4444-444444',
      role: UserRole.SELLER,
      phoneVerified: true,
    },
  });

  const dairyFarmer = await prisma.user.upsert({
    where: { email: 'dairy1@example.com' },
    update: {},
    create: {
      email: 'dairy1@example.com',
      name: 'Fatima Begum',
      phone: '+880-5555-555555',
      role: UserRole.SELLER,
      phoneVerified: true,
    },
  });

  // Create Shop Owner
  const shopOwner = await prisma.user.upsert({
    where: { email: 'shop1@example.com' },
    update: {},
    create: {
      email: 'shop1@example.com',
      name: 'Hasan Ali',
      phone: '+880-6666-666666',
      role: UserRole.SHOP_OWNER,
      phoneVerified: true,
    },
  });

  // Create Rider
  const rider = await prisma.user.upsert({
    where: { email: 'rider1@example.com' },
    update: {},
    create: {
      email: 'rider1@example.com',
      name: 'Mohammad Rider',
      phone: '+880-7777-777777',
      role: UserRole.RIDER,
      phoneVerified: true,
    },
  });

  // Create Addresses
  const address1 = await prisma.address.create({
    data: {
      userId: shopOwner.id,
      name: 'Hasan Ali',
      phone: '+880-6666-666666',
      addressLine1: 'Shop No. 25, Katabon Market',
      addressLine2: 'Green Road',
      city: 'Dhaka',
      state: 'Dhaka Division',
      postalCode: '1205',
      country: 'Bangladesh',
      isDefault: true,
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: customer1.id,
      name: 'John Smith',
      phone: '+880-1111-111111',
      addressLine1: 'House 45, Road 12',
      addressLine2: 'Dhanmondi',
      city: 'Dhaka',
      state: 'Dhaka Division',
      postalCode: '1209',
      country: 'Bangladesh',
      isDefault: true,
    },
  });

  // Create Shop
  const shop1 = await prisma.shop.create({
    data: {
      name: 'Fresh Valley Market',
      description: 'Premium quality agricultural products from local farmers',
      ownerId: shopOwner.id,
      addressId: address1.id,
      isVerified: true,
      rating: 4.5,
      totalSales: 150,
      commission: 8.0,
    },
  });

  // Create Delivery Area
  const deliveryArea = await prisma.deliveryArea.create({
    data: {
      name: 'Dhaka Central',
      boundaries: '{"type":"Polygon","coordinates":[[[90.3665,23.7465],[90.4203,23.7465],[90.4203,23.8103],[90.3665,23.8103],[90.3665,23.7465]]]}',
      deliveryFee: 50.0,
      estimatedDeliveryTime: 60, // 1 hour
    },
  });

  // Create Rider Profile
  const riderProfile = await prisma.riderProfile.create({
    data: {
      userId: rider.id,
      vehicleType: 'Motorcycle',
      vehicleNumber: 'DHK-1234',
      licenseNumber: 'DL-123456789',
      isVerified: true,
      isAvailable: true,
      currentLat: 23.7808,
      currentLng: 90.4192,
      totalDeliveries: 45,
      rating: 4.7,
      deliveryAreas: {
        connect: { id: deliveryArea.id },
      },
    },
  });

  // Create Products
  const products = [
    // Crops
    {
      name: 'Premium Basmati Rice',
      description: 'High-quality aromatic basmati rice from local farms',
      category: ProductCategory.CROPS,
      price: 120.0,
      unit: ProductUnit.KG,
      stockQuantity: 500,
      minOrderQuantity: 5,
      images: ['/images/basmati-rice.jpg'],
      sellerId: farmer1.id,
      shopId: shop1.id,
      isOrganic: true,
      harvestDate: new Date('2024-12-15'),
    },
    {
      name: 'Golden Wheat',
      description: 'Fresh wheat grains perfect for flour production',
      category: ProductCategory.CROPS,
      price: 85.0,
      unit: ProductUnit.KG,
      stockQuantity: 800,
      minOrderQuantity: 10,
      images: ['/images/wheat.jpg'],
      sellerId: farmer1.id,
      isOrganic: false,
      harvestDate: new Date('2024-11-20'),
    },
    // Vegetables
    {
      name: 'Fresh Tomatoes',
      description: 'Ripe, juicy tomatoes grown without pesticides',
      category: ProductCategory.VEGETABLES,
      price: 60.0,
      unit: ProductUnit.KG,
      stockQuantity: 200,
      minOrderQuantity: 2,
      images: ['/images/tomatoes.jpg'],
      sellerId: farmer1.id,
      shopId: shop1.id,
      isOrganic: true,
      harvestDate: new Date('2025-01-10'),
      expiryDate: new Date('2025-01-25'),
    },
    {
      name: 'Organic Carrots',
      description: 'Sweet, crunchy carrots grown organically',
      category: ProductCategory.VEGETABLES,
      price: 70.0,
      unit: ProductUnit.KG,
      stockQuantity: 150,
      minOrderQuantity: 1,
      images: ['/images/carrots.jpg'],
      sellerId: farmer1.id,
      isOrganic: true,
      harvestDate: new Date('2025-01-05'),
      expiryDate: new Date('2025-02-05'),
    },
    // Dairy
    {
      name: 'Fresh Cow Milk',
      description: 'Pure, fresh milk from grass-fed cows',
      category: ProductCategory.DAIRY,
      price: 80.0,
      unit: ProductUnit.LITER,
      stockQuantity: 100,
      minOrderQuantity: 1,
      images: ['/images/milk.jpg'],
      sellerId: dairyFarmer.id,
      shopId: shop1.id,
      isOrganic: true,
      expiryDate: new Date('2025-01-20'),
    },
    {
      name: 'Homemade Yogurt',
      description: 'Creamy, probiotic-rich yogurt made from fresh milk',
      category: ProductCategory.DAIRY,
      price: 120.0,
      unit: ProductUnit.KG,
      stockQuantity: 50,
      minOrderQuantity: 1,
      images: ['/images/yogurt.jpg'],
      sellerId: dairyFarmer.id,
      isOrganic: true,
      expiryDate: new Date('2025-01-18'),
    },
    // Fish
    {
      name: 'Fresh Rohu Fish',
      description: 'Freshly caught Rohu fish from local rivers',
      category: ProductCategory.FISH,
      price: 350.0,
      unit: ProductUnit.KG,
      stockQuantity: 75,
      minOrderQuantity: 1,
      images: ['/images/rohu-fish.jpg'],
      sellerId: farmer2.id,
      shopId: shop1.id,
      isOrganic: false,
      expiryDate: new Date('2025-01-16'),
    },
    {
      name: 'Hilsa Fish',
      description: 'Premium quality Hilsa fish, the king of Bengali fish',
      category: ProductCategory.FISH,
      price: 800.0,
      unit: ProductUnit.KG,
      stockQuantity: 30,
      minOrderQuantity: 1,
      images: ['/images/hilsa-fish.jpg'],
      sellerId: farmer2.id,
      isOrganic: false,
      expiryDate: new Date('2025-01-16'),
    },
    // Fruits
    {
      name: 'Fresh Mangoes',
      description: 'Sweet Himsagar mangoes from Chapainawabganj',
      category: ProductCategory.FRUITS,
      price: 180.0,
      unit: ProductUnit.KG,
      stockQuantity: 120,
      minOrderQuantity: 2,
      images: ['/images/mangoes.jpg'],
      sellerId: farmer1.id,
      shopId: shop1.id,
      isOrganic: false,
      harvestDate: new Date('2025-01-05'),
      expiryDate: new Date('2025-01-20'),
    },
    {
      name: 'Organic Bananas',
      description: 'Naturally ripened organic bananas',
      category: ProductCategory.FRUITS,
      price: 60.0,
      unit: ProductUnit.DOZEN,
      stockQuantity: 200,
      minOrderQuantity: 1,
      images: ['/images/bananas.jpg'],
      sellerId: farmer1.id,
      isOrganic: true,
      harvestDate: new Date('2025-01-08'),
      expiryDate: new Date('2025-01-18'),
    },
    {
      name: 'Local Oranges',
      description: 'Juicy sweet oranges from Sylhet hills',
      category: ProductCategory.FRUITS,
      price: 120.0,
      unit: ProductUnit.KG,
      stockQuantity: 80,
      minOrderQuantity: 1,
      images: ['/images/oranges.jpg'],
      sellerId: farmer2.id,
      isOrganic: false,
      harvestDate: new Date('2025-01-03'),
      expiryDate: new Date('2025-01-25'),
    },
    // Meat
    {
      name: 'Fresh Chicken',
      description: 'Farm-raised halal chicken, antibiotic-free',
      category: ProductCategory.MEAT,
      price: 280.0,
      unit: ProductUnit.KG,
      stockQuantity: 50,
      minOrderQuantity: 1,
      images: ['/images/chicken.jpg'],
      sellerId: farmer2.id,
      shopId: shop1.id,
      isOrganic: false,
      expiryDate: new Date('2025-01-18'),
    },
    {
      name: 'Goat Meat',
      description: 'Fresh goat meat from local farms',
      category: ProductCategory.MEAT,
      price: 850.0,
      unit: ProductUnit.KG,
      stockQuantity: 25,
      minOrderQuantity: 1,
      images: ['/images/goat-meat.jpg'],
      sellerId: farmer2.id,
      isOrganic: false,
      expiryDate: new Date('2025-01-17'),
    },
    {
      name: 'Beef (Premium Cut)',
      description: 'Premium quality beef from grass-fed cattle',
      category: ProductCategory.MEAT,
      price: 650.0,
      unit: ProductUnit.KG,
      stockQuantity: 35,
      minOrderQuantity: 1,
      images: ['/images/beef.jpg'],
      sellerId: farmer1.id,
      isOrganic: false,
      expiryDate: new Date('2025-01-19'),
    },
    // Grains
    {
      name: 'Red Lentils (Masoor)',
      description: 'High-protein red lentils for healthy cooking',
      category: ProductCategory.GRAINS,
      price: 85.0,
      unit: ProductUnit.KG,
      stockQuantity: 300,
      minOrderQuantity: 2,
      images: ['/images/red-lentils.jpg'],
      sellerId: farmer1.id,
      shopId: shop1.id,
      isOrganic: false,
      harvestDate: new Date('2024-12-20'),
    },
    {
      name: 'Chickpeas (Chola)',
      description: 'Premium quality chickpeas rich in protein',
      category: ProductCategory.GRAINS,
      price: 95.0,
      unit: ProductUnit.KG,
      stockQuantity: 250,
      minOrderQuantity: 2,
      images: ['/images/chickpeas.jpg'],
      sellerId: farmer2.id,
      isOrganic: false,
      harvestDate: new Date('2024-12-25'),
    },
    {
      name: 'Black Beans',
      description: 'Organic black beans perfect for healthy meals',
      category: ProductCategory.GRAINS,
      price: 120.0,
      unit: ProductUnit.KG,
      stockQuantity: 150,
      minOrderQuantity: 1,
      images: ['/images/black-beans.jpg'],
      sellerId: farmer1.id,
      isOrganic: true,
      harvestDate: new Date('2024-12-18'),
    },
    // Organic (special organic-certified products)
    {
      name: 'Organic Spinach',
      description: 'Certified organic fresh spinach leaves',
      category: ProductCategory.ORGANIC,
      price: 45.0,
      unit: ProductUnit.KG,
      stockQuantity: 80,
      minOrderQuantity: 1,
      images: ['/images/organic-spinach.jpg'],
      sellerId: farmer1.id,
      shopId: shop1.id,
      isOrganic: true,
      harvestDate: new Date('2025-01-10'),
      expiryDate: new Date('2025-01-20'),
    },
    {
      name: 'Organic Honey',
      description: 'Pure organic wildflower honey, unprocessed',
      category: ProductCategory.ORGANIC,
      price: 450.0,
      unit: ProductUnit.KG,
      stockQuantity: 40,
      minOrderQuantity: 1,
      images: ['/images/organic-honey.jpg'],
      sellerId: dairyFarmer.id,
      isOrganic: true,
      expiryDate: new Date('2026-01-15'),
    },
    {
      name: 'Organic Brown Rice',
      description: 'Certified organic brown rice with natural fiber',
      category: ProductCategory.ORGANIC,
      price: 140.0,
      unit: ProductUnit.KG,
      stockQuantity: 200,
      minOrderQuantity: 3,
      images: ['/images/organic-brown-rice.jpg'],
      sellerId: farmer1.id,
      isOrganic: true,
      harvestDate: new Date('2024-12-10'),
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: {
        ...productData,
        images: JSON.stringify(productData.images), // Convert array to JSON string
      },
    });
  }

  // Create Sample Coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: 'Welcome bonus - 10% off on first order',
      discountType: 'PERCENTAGE',
      discountValue: 10.0,
      minOrderValue: 200.0,
      maxDiscount: 100.0,
      usageLimit: 1000,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31'),
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'ORGANIC20',
      description: '20% off on organic products',
      discountType: 'PERCENTAGE',
      discountValue: 20.0,
      minOrderValue: 500.0,
      maxDiscount: 200.0,
      usageLimit: 500,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-06-30'),
    },
  });

  // Create Initial Analytics Entry
  await prisma.analytics.create({
    data: {
      date: new Date('2025-01-01'),
      totalOrders: 0,
      totalSales: 0.0,
      totalUsers: 7,
      totalProducts: 8,
      avgOrderValue: 0.0,
      topCategory: ProductCategory.VEGETABLES,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Users created: 7`);
  console.log(`🏪 Shops created: 1`);
  console.log(`📦 Products created: ${products.length}`);
  console.log(`🎫 Coupons created: 2`);
  console.log(`🚚 Delivery areas created: 1`);
  console.log(`🏍️ Rider profiles created: 1`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });