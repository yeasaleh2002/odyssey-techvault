"use client";

import { ShoppingBag, Package, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const mockOrders = [
  {
    id: "ORD-9824-XT",
    date: "2024-05-10",
    status: "Delivered",
    total: 1299.99,
    items: 2,
  },
  {
    id: "ORD-5192-QB",
    date: "2024-04-28",
    status: "Processing",
    total: 349.50,
    items: 1,
  },
  {
    id: "ORD-1104-MP",
    date: "2024-02-15",
    status: "Delivered",
    total: 89.99,
    items: 3,
  }
];

export default function UserOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and track your recent purchases.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-lg">Order History</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.items} {order.items === 1 ? 'item' : 'items'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {order.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Link 
          href="/items" 
          className="text-sm text-primary hover:underline font-medium"
        >
          Continue Shopping &rarr;
        </Link>
      </div>
    </div>
  );
}
