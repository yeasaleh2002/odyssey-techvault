"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  Eye,
  X,
  ChevronDown,
  Package,
  User as UserIcon,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
} from "lucide-react";
import { getAllOrders, updateOrderStatus, cancelOrder } from "@/lib/services/orders";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const statusConfig: Record<OrderStatus, { color: string; icon: any; bg: string }> = {
  Processing: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Loader2 },
  Shipped: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: Truck },
  Delivered: { color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  Cancelled: { color: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("Processing");
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
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

  const handleUpdateStatus = async () => {
    if (!editingOrder) return;
    setActionLoading(true);
    try {
      const res = await updateOrderStatus(editingOrder._id, newStatus);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o._id === res.data._id ? res.data : o)));
        toast.success(`Order status updated to ${newStatus}`);
        setEditingOrder(null);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setActionLoading(true);
    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o._id === res.data._id ? res.data : o)));
        toast.success("Order cancelled");
        if (selectedOrder?._id === orderId) setSelectedOrder(res.data);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders =
    filterStatus === "All" ? orders : orders.filter((o) => o.orderStatus === filterStatus);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="All">All Orders</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <ClipboardList className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Order ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Customer</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Items</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Total</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Date</th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.user?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.items?.length} item(s)</td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="View Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingOrder(order); setNewStatus(order.orderStatus); }}
                          disabled={order.orderStatus === "Cancelled" || order.orderStatus === "Delivered"}
                          className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Edit Status"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={order.orderStatus === "Cancelled" || order.orderStatus === "Delivered" || actionLoading}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Cancel Order"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Order Modal */}
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

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedOrder.orderStatus} />
                <span className="text-sm text-muted-foreground">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>

              {/* Customer */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <UserIcon className="w-4 h-4 text-primary" /> Customer
                </div>
                <p className="text-foreground font-medium">{selectedOrder.user?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
              </div>

              {/* Shipping */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <MapPin className="w-4 h-4 text-primary" /> Shipping Address
                </div>
                <p className="font-medium text-foreground">{selectedOrder.shippingAddress?.fullName}</p>
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
                <p className="text-sm text-foreground">{selectedOrder.paymentMethod}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                  selectedOrder.paymentStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Package className="w-4 h-4 text-primary" /> Order Items
                </div>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-muted/30 rounded-xl p-3">
                      <img
                        src={item.product?.image || "/placeholder.png"}
                        alt={item.product?.title}
                        className="w-14 h-14 rounded-lg object-cover border border-border"
                        onError={(e: any) => { e.target.src = "https://placehold.co/56x56/1a1a2e/ffffff?text=P"; }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{item.product?.title || "Product deleted"}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${selectedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setEditingOrder(selectedOrder); setNewStatus(selectedOrder.orderStatus); setSelectedOrder(null); }}
                  disabled={selectedOrder.orderStatus === "Cancelled" || selectedOrder.orderStatus === "Delivered"}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Edit Status
                </button>
                <button
                  onClick={() => { handleCancel(selectedOrder._id); setSelectedOrder(null); }}
                  disabled={selectedOrder.orderStatus === "Cancelled" || selectedOrder.orderStatus === "Delivered" || actionLoading}
                  className="flex-1 bg-red-500/10 text-red-500 py-2.5 rounded-xl font-medium hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Update Order Status</h2>
              <button onClick={() => setEditingOrder(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Order <span className="font-mono font-semibold text-foreground">#{editingOrder._id.slice(-8).toUpperCase()}</span>
              </p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {ORDER_STATUSES.map((s) => {
                    const cfg = statusConfig[s];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={s}
                        onClick={() => setNewStatus(s)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          newStatus === s
                            ? `${cfg.bg} ${cfg.color} border-current`
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {newStatus === "Cancelled" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  This action cannot be undone.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={actionLoading || newStatus === editingOrder.orderStatus}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
