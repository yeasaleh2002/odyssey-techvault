"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { LoadingSpinner } from "@/components/shared";
import { Trash2, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/users?role=admin');
      setAdmins(res.data.data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
      toast.error("Failed to load administrators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this administrator?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("Administrator deleted successfully");
      setAdmins(admins.filter(a => a._id !== id));
    } catch (error: any) {
      const msg = error.response?.data?.error || "Failed to delete administrator";
      toast.error(msg);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Admins</h1>
          <p className="text-muted-foreground mt-2">
            View and manage administrator accounts.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No administrators found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-full">
                        <Shield className="w-4 h-4" />
                      </div>
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{admin.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
