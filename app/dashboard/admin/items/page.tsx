"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, Trash2, Package, Search, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SectionTitle, LoadingSpinner } from "@/components/shared";
import { getProducts, deleteProduct as apiDeleteProduct } from "@/lib/services/product";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function AdminManageItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts({ 
        page, 
        limit: 10,
        keyword: searchQuery 
      });
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
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
      fetchProducts();
    }
  }, [authLoading, user, page, searchQuery]);

  // Show loading spinner while checking auth
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    router.push("/dashboard/user");
    return null;
  }

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
    <div className="space-y-8">
      <SectionTitle
        title="Inventory Management"
        subtitle="Manage all products across the TechVault store"
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, or brand..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <Link
          href="/items/add"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {products.map((product) => {
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
                            <p className="font-semibold text-foreground truncate max-w-[200px]">{product.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{product.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                         <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-500">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                           In Stock
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/items/${id}`} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link href={`/items/edit/${id}`} className="p-2 text-muted-foreground hover:text-blue-500 transition-colors">
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
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

        {/* Pagination */}
        {(pagination.prev || pagination.next) && (
          <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.prev}
              className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.next}
              className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {!isLoading && products.length === 0 && (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
           <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
           <p className="text-muted-foreground">No products found in the database.</p>
        </div>
      )}
    </div>
  );
}
