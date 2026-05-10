const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const sampleProducts = [
  {
    title: "iPhone 15 Pro",
    shortDescription: "Titanium design with A17 Pro chip and advanced camera system.",
    fullDescription: "iPhone 15 Pro features a strong and light aerospace-grade titanium design with a textured matte-glass back. It's equipped with the A17 Pro chip, the most powerful chip ever in a smartphone, enabling console-quality gaming and advanced computational photography. The Pro camera system includes a 48MP Main camera with a new super-high-resolution 24MP default, a 3x Telephoto camera, and an Ultra Wide camera. Action button lets you quickly access your favorite feature.",
    price: 999,
    originalPrice: 1099,
    category: "Phones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 3421,
    inStock: true,
    featured: true,
    deal: true,
    specifications: [
      { label: "Display", value: "6.1-inch Super Retina XDR" },
      { label: "Chip", value: "A17 Pro" }
    ]
  },
  {
    title: "MacBook Air M3",
    shortDescription: "Supercharged by M3 chip with up to 18 hours of battery life.",
    fullDescription: "MacBook Air with M3 chip is an extraordinarily portable laptop that's strikingly thin and brings an 8-core CPU and up to 10-core GPU.",
    price: 1099,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: 1823,
    inStock: true,
    featured: true,
    specifications: [
      { label: "Chip", value: "Apple M3" }
    ]
  }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        firebaseUid: 'dummy_admin_firebase_uid_123',
        role: 'admin'
      },
      {
        name: 'Demo User',
        email: 'user@example.com',
        password: 'user123',
        firebaseUid: 'dummy_user_firebase_uid_456',
        role: 'user'
      }
    ]);

    const adminUserId = createdUsers[0]._id;

    const productsToInsert = sampleProducts.map(product => {
      return { ...product, createdBy: adminUserId };
    });

    await Product.create(productsToInsert);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
