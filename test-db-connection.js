const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test 1: Connect to database
    console.log('1️⃣ Testing connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to database!\n');
    
    // Test 2: Count existing products
    console.log('2️⃣ Checking existing products...');
    const productCount = await prisma.product.count();
    console.log(`✅ Found ${productCount} products in database\n`);
    
    // Test 3: Create a test product
    console.log('3️⃣ Creating test product...');
    const testProduct = await prisma.product.create({
      data: {
        productCode: `TEST-${Date.now()}`,
        name: 'Test Product - Persistence Check',
        price: 99.99,
        stockQuantity: 10,
        imageUrl: null
      }
    });
    console.log(`✅ Created test product: ${testProduct.name} (ID: ${testProduct.id})\n`);
    
    // Test 4: Retrieve the product
    console.log('4️⃣ Retrieving test product...');
    const retrieved = await prisma.product.findUnique({
      where: { id: testProduct.id }
    });
    console.log(`✅ Retrieved product: ${retrieved.name}\n`);
    
    // Test 5: Delete the test product
    console.log('5️⃣ Cleaning up test product...');
    await prisma.product.delete({
      where: { id: testProduct.id }
    });
    console.log('✅ Test product deleted\n');
    
    // Test 6: Check users
    console.log('6️⃣ Checking users...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database\n`);
    
    console.log('🎉 All database tests passed!');
    console.log('✅ Database is properly configured and working');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check that DATABASE_URL is set in .env file');
    console.error('2. Verify the connection string is correct');
    console.error('3. Run: npx prisma db push');
    console.error('4. Run: npx prisma generate');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
