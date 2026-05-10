"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  Loader2,
  Search,
  Star,
  AlertCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/services/product";
import { uploadToImgBB } from "@/lib/uploadImage";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Phones",
  "Laptops",
  "Tablets",
  "Desktops",
  "Monitors",
  "Accessories",
  "Audio",
  "Gaming",
  "Networking",
  "Storage",
  "Other",
];

const emptyForm = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  price: "",
  originalPrice: "",
  category: "",
  image: "",
  rating: "",
  deal: false,
  featured: false,
  inStock: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      if (res.success) setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setForm({
      title: product.title || "",
      shortDescription: product.shortDescription || "",
      fullDescription: product.fullDescription || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category || "",
      image: product.image || "",
      rating: product.rating?.toString() || "",
      deal: product.deal || false,
      featured: product.featured || false,
      inStock: product.inStock !== undefined ? product.inStock : true,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setForm({ ...form, image: url });
      toast.success("Image uploaded to ImgBB!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category || !form.image) {
      toast.error("Please fill all required fields");
      return;
    }
    setFormLoading(true);
    try {
      const payload: any = {
        ...form,
        price: parseFloat(form.price),
        rating: parseFloat((form as any).rating || "0"),
      };
      if ((form as any).originalPrice) payload.originalPrice = parseFloat((form as any).originalPrice);
      else delete payload.originalPrice;

      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, payload);
        if (res.success) {
          setProducts((prev) => prev.map((p) => (p._id === res.data._id ? res.data : p)));
          toast.success("Product updated successfully");
        }
      } else {
        const res = await createProduct(payload);
        if (res.success) {
          setProducts((prev) => [res.data, ...prev]);
          toast.success("Product added successfully");
        }
      }
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} product(s) in catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <Package className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">No products found</p>
          <button onClick={openAdd} className="mt-4 text-primary text-sm hover:underline">
            Add your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative h-44 bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e: any) => {
                    e.target.src = "https://placehold.co/400x200/1a1a2e/ffffff?text=Product";
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-1">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">{product.category}</span>
                  {product.deal && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">DEAL</span>}
                  {!product.inStock && <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full">Out</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                  {product.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {product.shortDescription}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary">${product.price?.toFixed(2)}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-medium text-foreground">{product.rating || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold text-foreground">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Preview */}
              {form.image && (
                <div className="w-full h-44 rounded-xl overflow-hidden border border-border">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e: any) => { e.target.src = "https://placehold.co/600x200/1a1a2e/ffffff?text=Invalid+URL"; }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Product title"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Product Image <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="space-y-4">
                    {/* File Upload Zone */}
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                          uploadingImage 
                            ? "bg-muted border-border cursor-wait" 
                            : form.image 
                              ? "bg-muted/30 border-primary/30 hover:border-primary/50" 
                              : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                            <span className="text-sm font-semibold text-foreground">Uploading to ImgBB...</span>
                            <span className="text-xs text-muted-foreground mt-1">Please wait a moment</span>
                          </>
                        ) : form.image ? (
                          <>
                            <div className="absolute inset-0 p-2">
                              <img src={form.image} className="w-full h-full object-cover rounded-xl opacity-20" alt="" />
                            </div>
                            <Upload className="w-8 h-8 text-primary mb-2 relative z-10" />
                            <span className="text-sm font-bold text-foreground relative z-10">Image Uploaded!</span>
                            <span className="text-xs text-muted-foreground mt-1 relative z-10">Click to change the image</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                            <span className="text-base font-bold text-foreground">Click to upload product image</span>
                            <span className="text-xs text-muted-foreground mt-1 text-center px-4">
                              High resolution PNG or JPG (recommended 800x800 or 16:9)
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    {form.image && (
                      <p className="text-[11px] text-center text-green-600 font-medium bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                        ✓ Image successfully hosted on ImgBB
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Original Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={(form as any).originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value } as any)}
                    placeholder="Leave blank if no discount"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Rating (0–5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={(form as any).rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value } as any)}
                    placeholder="0.0"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-4">
                  {(["deal", "featured", "inStock"] as const).map((field) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(form as any)[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.checked } as any)}
                        className="w-4 h-4 rounded text-primary"
                      />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {field === "inStock" ? "In Stock" : field === "deal" ? "Deal / On Sale" : "Featured"}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Short Description</label>
                  <input
                    type="text"
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    placeholder="Brief product summary"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Description</label>
                  <textarea
                    rows={4}
                    value={form.fullDescription}
                    onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                    placeholder="Detailed product description..."
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Delete Product</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
