# Odyssey TechVault

A modern, full-stack e-commerce platform for tech gadgets built with Next.js 14, TypeScript, Firebase Authentication, and Tailwind CSS.

## Project Description

Odyssey TechVault is a premium tech e-commerce application featuring a sleek, responsive design with smooth animations. Users can browse products, add items to cart, create accounts, and manage their own product listings. The platform showcases 6 premium tech gadgets including smartphones, laptops, headphones, and gaming devices.

## Key Features

- **Modern UI/UX**: Premium SaaS-style design with Framer Motion animations, responsive layouts, and dark-themed aesthetics
- **Product Catalog**: Browse, search, filter, and sort products by category, price, and rating
- **Product Details**: Rich product pages with specifications, image galleries, and related products
- **Shopping Cart**: Add/remove items, update quantities, with localStorage persistence
- **Firebase Authentication**: Email/password login, registration, and Google Sign-In
- **Protected Routes**: Add and manage products (requires authentication)
- **Product Management**: Create new listings with localStorage persistence, view/delete products
- **SEO Optimized**: Meta tags, semantic HTML, and proper heading structure
- **Fully Responsive**: Mobile-first design that works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd odyssey-techvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** 
   
   The app includes default Firebase configuration. To use your own Firebase project:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password and Google Sign-In)
   - Update the configuration in `lib/firebase.ts`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Route Summary

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Homepage with hero, featured products, categories, testimonials | Public |
| `/items` | Product catalog with search, filters, and sorting | Public |
| `/items/[id]` | Individual product detail page | Public |
| `/items/add` | Add new product form | Protected |
| `/items/manage` | View and manage all products | Protected |
| `/deals` | Special offers and discounted products | Public |
| `/about` | Company information, mission, team | Public |
| `/contact` | Contact form and company details | Public |
| `/cart` | Shopping cart with checkout | Public |
| `/login` | User login page | Public |
| `/register` | User registration page | Public |

## Project Structure

```
├── app/
│   ├── about/
│   ├── cart/
│   ├── contact/
│   ├── deals/
│   ├── items/
│   │   ├── [id]/
│   │   ├── add/
│   │   └── manage/
│   ├── login/
│   ├── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Categories.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTABanner.tsx
│   │   └── Newsletter.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── ProductCard.tsx
│       ├── SectionTitle.tsx
│       └── LoadingSpinner.tsx
├── context/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── data/
│   └── products.ts
├── lib/
│   └── firebase.ts
└── types/
    └── index.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - feel free to use this project for learning or commercial purposes.

# Author 
Yeasaleh
