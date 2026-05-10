"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, RotateCcw, ImageIcon, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SectionTitle, LoadingSpinner } from "@/components/shared";
import { categories } from "@/data/products";
import { saveProduct } from "@/lib/storage";
import { getProductById } from "@/lib/services/product";
import { uploadToImgBB } from "@/lib/uploadImage";
import toast from "react-hot-toast";

const initialFormData = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  price: "",
  category: "",
  image: "",
  rating: "4.5",
};

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data.success && data.data) {
          const product = data.data;
          setFormData({
            title: product.title || product.name || "",
            shortDescription: product.shortDescription || "",
            fullDescription: product.fullDescription || "",
            price: product.price?.toString() || "",
            category: product.category || "",
            image: product.image || "",
            rating: product.rating?.toString() || "4.5",
          });
        } else {
          toast.error("Product not found");
          router.push("/items/manage");
        }
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/items/manage");
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  if (loading || isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (user.role !== "admin") {
    router.push("/dashboard/user");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    toast.success("Form reset successfully");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.shortDescription || !formData.fullDescription || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate backend update since PUT route is not strictly required by specs
    toast.error("Backend update route not implemented in this phase");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/items/manage"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manage Products
        </Link>

        <SectionTitle
          title="Edit Product"
          subtitle="Update the details of your listing"
        />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="p-6 md:p-8 bg-card border border-border rounded-2xl"
        >
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Image
            </label>
            <div className="relative">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border bg-muted/50">
                   <LoadingSpinner size="lg" />
                   <p className="mt-2 text-sm text-muted-foreground">Uploading image...</p>
                </div>
              ) : formData.image ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground">JPEG, PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g., MacBook Pro 16&quot; M3 Max"
            />
          </div>

          {/* Short Description */}
          <div className="mb-4">
            <label htmlFor="shortDescription" className="block text-sm font-medium text-foreground mb-2">
              Short Description *
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Brief product tagline (max 100 characters)"
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.shortDescription.length}/100 characters</p>
          </div>

          {/* Full Description */}
          <div className="mb-4">
            <label htmlFor="fullDescription" className="block text-sm font-medium text-foreground mb-2">
              Full Description *
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Detailed product description with features and benefits..."
            />
          </div>

          {/* Price and Rating */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-2">
                Rating (1-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="4.5"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-8">
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="">Select a category</option>
              {categories.filter(c => c !== "All").map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Updating Product...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Update
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting || isUploading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
