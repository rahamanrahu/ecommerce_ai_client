/**
 * Database Seed Script
 * Creates sample data for testing
 */

const mongoose = require('mongoose');
const config = require('./env/config');
const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        // Connect to database
        await mongoose.connect(config.database.uri);
        console.log('Connected to database for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create sample user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'Demo@123',
            role: 'user',
            address: {
                street: '123 Demo Street',
                city: 'Demo City',
                state: 'Demo State',
                zipCode: '12345',
                country: 'Demo Country'
            },
            phone: '+1234567890'
        });
        console.log('Created demo user:', demoUser.email);

        // Create sample products
        const products = [
            {
                name: 'Wireless Bluetooth Headphones',
                description: 'Premium wireless headphones with noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
                price: 149.99,
                compareAtPrice: 199.99,
                stock: 50,
                category: 'Electronics',
                subcategory: 'Audio',
                images: ['https://via.placeholder.com/400x400?text=Headphones'],
                sku: 'ELEC-AUDIO-001',
                tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
                isActive: true,
                isFeatured: true
            },
            {
                name: 'Smart Fitness Watch',
                description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50 meters.',
                price: 199.99,
                stock: 30,
                category: 'Electronics',
                subcategory: 'Wearables',
                images: ['https://via.placeholder.com/400x400?text=Smart+Watch'],
                sku: 'ELEC-WEAR-001',
                tags: ['smartwatch', 'fitness', 'health', 'wearable'],
                isActive: true,
                isFeatured: true
            },
            {
                name: 'Organic Cotton T-Shirt',
                description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors. Soft, breathable, and eco-friendly.',
                price: 29.99,
                stock: 100,
                category: 'Clothing',
                subcategory: 'Men',
                images: ['https://via.placeholder.com/400x400?text=T-Shirt'],
                sku: 'CLOTH-MEN-001',
                tags: ['organic', 'cotton', 't-shirt', 'sustainable'],
                isActive: true,
                isFeatured: false
            },
            {
                name: 'Running Shoes Pro',
                description: 'Professional running shoes with advanced cushioning technology. Lightweight design for maximum performance and comfort.',
                price: 129.99,
                compareAtPrice: 159.99,
                stock: 25,
                category: 'Footwear',
                subcategory: 'Sports',
                images: ['https://via.placeholder.com/400x400?text=Running+Shoes'],
                sku: 'FOOT-SPORT-001',
                tags: ['running', 'shoes', 'sports', 'athletic'],
                isActive: true,
                isFeatured: true
            },
            {
                name: 'Laptop Backpack',
                description: 'Durable laptop backpack with multiple compartments, USB charging port, and water-resistant material. Fits laptops up to 15.6 inches.',
                price: 59.99,
                stock: 40,
                category: 'Accessories',
                subcategory: 'Bags',
                images: ['https://via.placeholder.com/400x400?text=Backpack'],
                sku: 'ACC-BAG-001',
                tags: ['backpack', 'laptop', 'travel', 'bag'],
                isActive: true,
                isFeatured: false
            },
            {
                name: 'Ceramic Coffee Mug Set',
                description: 'Set of 4 elegant ceramic coffee mugs. Microwave and dishwasher safe. Perfect for your morning coffee or tea.',
                price: 34.99,
                stock: 60,
                category: 'Home',
                subcategory: 'Kitchen',
                images: ['https://via.placeholder.com/400x400?text=Coffee+Mugs'],
                sku: 'HOME-KITC-001',
                tags: ['mugs', 'coffee', 'ceramic', 'kitchen'],
                isActive: true,
                isFeatured: false
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with adjustable DPI, silent clicks, and 2-year battery life. Compatible with all operating systems.',
                price: 39.99,
                stock: 75,
                category: 'Electronics',
                subcategory: 'Accessories',
                images: ['https://via.placeholder.com/400x400?text=Mouse'],
                sku: 'ELEC-ACC-001',
                tags: ['mouse', 'wireless', 'computer', 'accessories'],
                isActive: true,
                isFeatured: false
            },
            {
                name: 'Yoga Mat Premium',
                description: 'Non-slip yoga mat with extra cushioning for joint protection. Eco-friendly material, includes carrying strap.',
                price: 49.99,
                compareAtPrice: 69.99,
                stock: 35,
                category: 'Sports',
                subcategory: 'Fitness',
                images: ['https://via.placeholder.com/400x400?text=Yoga+Mat'],
                sku: 'SPORT-FIT-001',
                tags: ['yoga', 'fitness', 'mat', 'exercise'],
                isActive: true,
                isFeatured: true
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log(`Created ${createdProducts.length} products`);

        console.log('\n' + '='.repeat(50));
        console.log('Seed completed successfully!');
        console.log('='.repeat(50));
        console.log('Sample Login Credentials:');
        console.log('  Email: demo@example.com');
        console.log('  Password: Demo@123');
        console.log('='.repeat(50));

        // Close connection
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

// Run seed if this file is executed directly
if (require.main === module) {
    seedData();
}

module.exports = seedData;
