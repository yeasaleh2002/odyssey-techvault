"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  Package,
  XCircle,
  CheckCircle2,
  Truck,
  Loader2,
  Eye,
  X,
  MapPin,
  CreditCard,
} from "lucide-react";
import { getMyOrders, cancelOrder } from "@/lib/services/orders";
import toast from "react-hot-toast";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

const statusConfig: Record<OrderStatus, { color: string; bg: string; icon: any }> = {
  Processing: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Loader2 },
  Shipped: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: Truck },
  Delivered: { color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  Cancelled: { color: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      if (res.success) setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (orderId: string) => {
    if (!confirm("Cancel this order?")) return;
    setCancelling(orderId);
    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o._id === res.data._id ? res.data : o)));
        if (selectedOrder?._id === orderId) setSelectedOrder(res.data);
        toast.success("Order cancelled successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to cancel order");
    } finally {
      setCancelling(null);
    }
  };

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const cfg = statusConfig[status] || statusConfig.Processing;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage your orders</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <ShoppingBag className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">No orders yet</p>
          <a href="/items" className="mt-3 text-primary text-sm hover:underline">Browse products →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-sm text-muted-foreground">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.items?.length} item(s) · Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-foreground">${order.totalAmount?.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {(order.orderStatus === "Processing" || order.orderStatus === "Shipped") && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancelling === order._id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {cancelling === order._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mini item preview */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {order.items?.slice(0, 4).map((item: any, i: number) => (
                  <img
                    key={i}
                    src={item.product?.image || "https://placehold.co/48x48"}
                    alt={item.product?.title}
                    className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                    onError={(e: any) => { e.target.src = "https://placehold.co/48x48/1a1a2e/ffffff?text=P"; }}
                  />
                ))}
                {order.items?.length > 4 && (
                  <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Order Details</h2>
                <p className="text-sm text-muted-foreground font-mono">
                  #{selectedOrder._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedOrder.orderStatus} />
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>

              {/* Shipping */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <MapPin className="w-4 h-4 text-primary" /> Shipping Address
                </div>
                <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress?.country}</p>
              </div>

              {/* Payment */}
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Payment
                </div>
                <p className="text-sm">{selectedOrder.paymentMethod}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                  selectedOrder.paymentStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Package className="w-4 h-4 text-primary" /> Items
                </div>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-muted/30 rounded-xl p-3">
                      <img
                        src={item.product?.image || "https://placehold.co/56x56"}
                        alt={item.product?.title}
                        className="w-14 h-14 rounded-lg object-cover border border-border"
                        onError={(e: any) => { e.target.src = "https://placehold.co/56x56/1a1a2e/ffffff?text=P"; }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{item.product?.title || "Product deleted"}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">${selectedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {(selectedOrder.orderStatus === "Processing" || selectedOrder.orderStatus === "Shipped") && (
                <button
                  onClick={() => { handleCancel(selectedOrder._id); }}
                  disabled={cancelling === selectedOrder._id}
                  className="w-full bg-red-500/10 text-red-500 py-2.5 rounded-xl font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cancelling === selectedOrder._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
