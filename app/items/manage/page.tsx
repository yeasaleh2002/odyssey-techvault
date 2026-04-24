"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, Trash2, Package, Search, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SectionTitle, LoadingSpinner } from "@/components/shared";
import { getProducts, deleteProduct } from "@/lib/storage";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function ManageItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      setProducts(getProducts());
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  // Show loading spinner while checking auth
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    router.push("/login");
    return null;
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
    setProducts(products.filter((p) => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/items"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Products
        </Link>

        <SectionTitle
          title="Manage Products"
          subtitle="View and manage all your listed products"
        />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <Link
            href="/items/add"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Products List */}
        {filteredProducts.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product) => (
                        <motion.tr
                          key={product.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-[250px]">
                                  {product.name}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {product.shortDescription}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-foreground">
                              ${product.price.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/items/${product.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Link>
                              <Link
                                href={`/items/edit/${product.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
                                aria-label="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {product.name}
                        </h3>
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary mt-1">
                          {product.category}
                        </span>
                        <p className="text-lg font-bold text-foreground mt-2">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/items/${product.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        href={`/items/edit/${product.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-6 bg-muted rounded-full mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">No Products Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery
                ? "No products match your search criteria. Try a different search term."
                : "You haven't listed any products yet. Start by adding your first product."}
            </p>
            <Link
              href="/items/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Product
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
