const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const sampleProducts = [
  {
    title: "iPhone 15 Pro",
    shortDescription: "Titanium design with A17 Pro chip and advanced camera system.",
    fullDescription: "iPhone 15 Pro features a strong and light aerospace-grade titanium design with a textured matte-glass back. Equipped with the A17 Pro chip, enabling console-quality gaming and advanced computational photography. The Pro camera system includes a 48MP Main camera, a 3x Telephoto camera, and an Ultra Wide camera.",
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
      { label: "Chip", value: "A17 Pro" },
      { label: "Camera", value: "48MP Main + 12MP Ultra Wide + 12MP Telephoto" },
      { label: "Storage", value: "128GB / 256GB / 512GB / 1TB" },
      { label: "Battery", value: "Up to 23 hours video playback" },
      { label: "Material", value: "Aerospace-grade Titanium" }
    ]
  },
  {
    title: "Samsung Galaxy S24",
    shortDescription: "AI-powered smartphone with stunning display and pro-grade camera.",
    fullDescription: "Samsung Galaxy S24 introduces Galaxy AI, bringing a new world of mobile experiences. Features a brilliant 6.2-inch Dynamic AMOLED 2X display with Vision Booster for exceptional clarity. The advanced camera system with 50MP main sensor captures stunning photos in any light.",
    price: 799,
    originalPrice: 899,
    category: "Phones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: 2156,
    inStock: true,
    featured: true,
    deal: true,
    specifications: [
      { label: "Display", value: "6.2-inch Dynamic AMOLED 2X" },
      { label: "Processor", value: "Snapdragon 8 Gen 3" },
      { label: "Camera", value: "50MP Main + 12MP Ultra Wide + 10MP Telephoto" },
      { label: "Storage", value: "128GB / 256GB / 512GB" },
      { label: "Battery", value: "4000mAh with 25W fast charging" },
      { label: "Features", value: "Galaxy AI, IP68 Water Resistance" }
    ]
  },
  {
    title: "MacBook Air M3",
    shortDescription: "Supercharged by M3 chip with up to 18 hours of battery life.",
    fullDescription: "MacBook Air with M3 chip is an extraordinarily portable laptop that's strikingly thin and brings an 8-core CPU and up to 10-core GPU. The 13.6-inch Liquid Retina display supports 1 billion colors and 500 nits of brightness. Up to 18 hours of battery life.",
    price: 1099,
    originalPrice: 1299,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: 1823,
    inStock: true,
    featured: true,
    deal: false,
    specifications: [
      { label: "Chip", value: "Apple M3 (8-core CPU, 10-core GPU)" },
      { label: "Display", value: "13.6-inch Liquid Retina" },
      { label: "Memory", value: "8GB / 16GB / 24GB Unified Memory" },
      { label: "Storage", value: "256GB / 512GB / 1TB / 2TB SSD" },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Weight", value: "2.7 pounds (1.24 kg)" }
    ]
  },
  {
    title: "Sony WH-1000XM5",
    shortDescription: "Industry-leading noise cancellation with exceptional sound quality.",
    fullDescription: "The Sony WH-1000XM5 headphones rewrite the rules for noise cancellation with eight microphones and two processors. Enjoy an exceptionally natural and accurate sound with the new 30mm driver unit. 30-hour battery life with quick charging.",
    price: 279,
    originalPrice: 399,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 2890,
    inStock: true,
    featured: true,
    deal: true,
    specifications: [
      { label: "Driver", value: "30mm, dome type" },
      { label: "Noise Canceling", value: "8 microphones with Auto NC Optimizer" },
      { label: "Battery Life", value: "30 hours with NC on" },
      { label: "Connectivity", value: "Bluetooth 5.2, Multipoint" },
      { label: "Weight", value: "250g" },
      { label: "Features", value: "Speak-to-Chat, Adaptive Sound Control" }
    ]
  },
  {
    title: "Logitech MX Master 3S",
    shortDescription: "Advanced wireless mouse with ultra-fast scrolling and precision tracking.",
    fullDescription: "The Logitech MX Master 3S is the iconic mouse for advanced users remastered. Features an 8K DPI optical sensor for tracking on virtually any surface including glass. MagSpeed electromagnetic scroll wheel is fast enough to scroll 1,000 lines per second.",
    price: 99,
    originalPrice: 129,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: 3156,
    inStock: true,
    featured: true,
    deal: false,
    specifications: [
      { label: "Sensor", value: "8000 DPI Darkfield" },
      { label: "Scroll Wheel", value: "MagSpeed Electromagnetic" },
      { label: "Battery", value: "Up to 70 days, USB-C charging" },
      { label: "Connectivity", value: "Bluetooth, Logi Bolt USB" },
      { label: "Buttons", value: "7 programmable buttons" },
      { label: "Compatibility", value: "Windows, macOS, Linux, iPadOS" }
    ]
  },
  {
    title: "Steam Deck OLED",
    shortDescription: "Handheld gaming PC with stunning HDR OLED display.",
    fullDescription: "Steam Deck OLED is the ultimate handheld gaming PC, now featuring a stunning 7.4-inch HDR OLED display with 90Hz refresh rate. The new display delivers true blacks, vibrant colors, and incredibly smooth gameplay. Access your entire Steam library wherever you go.",
    price: 499,
    originalPrice: 599,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1640955014216-75201056c829?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: 1567,
    inStock: true,
    featured: true,
    deal: true,
    specifications: [
      { label: "Display", value: "7.4-inch HDR OLED, 1280x800, 90Hz" },
      { label: "Processor", value: "AMD APU (Zen 2 + RDNA 2)" },
      { label: "Memory", value: "16GB LPDDR5" },
      { label: "Storage", value: "512GB / 1TB NVMe SSD" },
      { label: "Battery", value: "50Whr, 3-12 hours gameplay" },
      { label: "Connectivity", value: "Wi-Fi 6E, Bluetooth 5.3" }
    ]
  },
  {
    title: "Dell XPS 15",
    shortDescription: "Premium laptop with InfinityEdge display and powerful performance.",
    fullDescription: "The Dell XPS 15 is the perfect balance of performance and portability. Featuring a stunning 15.6-inch InfinityEdge OLED display and powered by Intel Core i7 processor with NVIDIA GeForce RTX graphics. Ideal for creative professionals and power users.",
    price: 1799,
    originalPrice: 1999,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=800&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: 987,
    inStock: true,
    featured: false,
    deal: false,
    specifications: [
      { label: "Display", value: "15.6-inch 3.5K OLED 60Hz" },
      { label: "Processor", value: "Intel Core i7-13700H" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4060" },
      { label: "RAM", value: "16GB DDR5" },
      { label: "Storage", value: "512GB NVMe SSD" },
      { label: "Battery", value: "86Whr, up to 13 hours" }
    ]
  },
  {
    title: "Apple AirPods Pro 2",
    shortDescription: "Active Noise Cancellation with Adaptive Audio for immersive sound.",
    fullDescription: "AirPods Pro (2nd generation) feature the H2 chip, delivering twice the noise cancellation of AirPods Pro 1st gen. Adaptive Audio automatically tailors the noise control to your environment. With up to 30 hours of total battery life with the case.",
    price: 199,
    originalPrice: 249,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: 4231,
    inStock: true,
    featured: true,
    deal: true,
    specifications: [
      { label: "Chip", value: "Apple H2" },
      { label: "ANC", value: "Adaptive Transparency, Active Noise Cancellation" },
      { label: "Battery", value: "6h (buds) + 24h (case) = 30h total" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Water Resistance", value: "IPX4" },
      { label: "Features", value: "Spatial Audio, Personalized Volume" }
    ]
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();

    // Find or create admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@techvault.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    const productsToInsert = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    await Product.create(productsToInsert);

    console.log(`✅ ${productsToInsert.length} products imported!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('✅ Products Destroyed!');
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
