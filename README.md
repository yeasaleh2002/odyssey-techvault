# Odyssey TechVault 🚀

Odyssey TechVault is a premium production-grade e-commerce platform for high-end technology. Built with Next.js, Express, and MongoDB, it features a robust role-based authentication system, advanced product management, and a high-performance interactive UI.

## 🌟 Key Features
- **Role-Based Access**: Specialized dashboards for Admins (Inventory, Users) and Customers (Profile, My Items).
- **Secure Auth**: JWT-based session management with HttpOnly cookies and transparent token refresh.
- **Product Engine**: Advanced filtering, live search, and real-time inventory management.
- **Cloud Media**: Integrated with ImgBB for optimized image hosting.
- **Modern UI**: 8px grid system, dark/light mode, and Framer Motion animations.
- **Contact System**: Fully functional inquiry form with backend storage.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Authentication**: JWT (Access/Refresh Tokens).
- **State Management**: React Context API.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- ImgBB API Key

### 2. Environment Setup

Create a `.env.local` file in the **root (frontend)** directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

Create a `.env` file in the **server** directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
```

### 3. Installation & Development

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
# In the root directory
npm install
npm run dev
```

### 4. Database Seeding (Optional)
To populate the database with professional technology items:
```bash
cd server
npm run seed
```

## 🔐 API Reference

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | Login & set cookies | Public |
| `/api/products` | GET | List products (filtered) | Public |
| `/api/products/:id` | GET | Single product details | Public |
| `/api/products` | POST | Create product | Private |
| `/api/contact` | POST | Submit inquiry | Public |

## 🛡 Security Features
- **Helmet**: Secure HTTP headers.
- **Sanitization**: Protection against NoSQL injection and XSS.
- **Rate Limiting**: Brute-force protection on API endpoints.
- **JWT Best Practices**: Access tokens in memory, Refresh tokens in HttpOnly cookies.

## 🎯 Demo Login
- **Admin**: `admin@techvault.com` / `admin123`
- **User**: `user@techvault.com` / `user123`

## 📦 Deployment
- **Frontend**: Deploy to **Vercel** (connect root folder).
- **Backend**: Deploy to **Render** or **Railway**. Set `NODE_ENV=production` and ensure CORS allows your Vercel URL.

---
Built with ❤️ by the Odyssey Team.
