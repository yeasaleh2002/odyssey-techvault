"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, Trash2, Package, Search, ArrowLeft, Edit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SectionTitle, LoadingSpinner } from "@/components/shared";
import { getProducts, deleteProduct as apiDeleteProduct } from "@/lib/services/product";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function ManageItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProducts = async () => {
    setIsLoading(true);
    try {
      // For now, we fetch all products. Ideally, backend should filter by owner.
      const data = await getProducts();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to load products", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchUserProducts();
    }
  }, [authLoading, user]);

  // Show loading spinner while checking auth
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect if not logged in or not admin
  if (!user) {
    router.push("/login");
    return null;
  }

  if (user.role !== "admin") {
    router.push("/dashboard/user");
    return null;
  }

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await apiDeleteProduct(productId);
      setProducts(products.filter((p) => (p.id || (p as any)._id) !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
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
              placeholder="Search products by title or category..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <Link
            href="/items/add"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Products List */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product) => {
                        const id = product.id || (product as any)._id;
                        return (
                          <motion.tr
                            key={id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                  <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-foreground truncate max-w-[200px]">
                                    {product.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {product.shortDescription}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-foreground">
                              ${product.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/items/${id}`}
                                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                  title="View"
                                >
                                  <Eye className="w-5 h-5" />
                                </Link>
                                <Link
                                  href={`/items/edit/${id}`}
                                  className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(id)}
                                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-card border border-border border-dashed rounded-3xl">
            <div className="inline-flex p-6 bg-muted rounded-full mb-6 text-muted-foreground">
              <Package className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">No Products Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery
                ? "No products match your search. Try adjusting your search term."
                : "Your store is currently empty. Start adding products to showcase them to the world."}
            </p>
            <Link
              href="/items/add"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
