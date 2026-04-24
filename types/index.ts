export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  deal?: boolean;
  specifications: ProductSpecification[];
  createdAt: Date;
  userId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}
