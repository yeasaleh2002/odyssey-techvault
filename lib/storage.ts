import { Product } from "@/types";
import { sampleProducts } from "@/data/products";

const STORAGE_KEY = "odyssey_products";

export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return sampleProducts;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with sample products if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProducts));
    return sampleProducts;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return sampleProducts;
  }
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const saveProduct = (product: Product): void => {
  if (typeof window === "undefined") return;
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const deleteProduct = (id: string): void => {
  if (typeof window === "undefined") return;
  const products = getProducts();
  const updated = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
