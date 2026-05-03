"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users as UsersIcon, 
  Search, 
  Trash2, 
  ShieldCheck, 
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import api from "@/lib/api";
import { LoadingSpinner, SectionTitle } from "@/components/shared";
import { User } from "@/types";
import toast from "react-hot-toast";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real app, backend would support pagination: /api/auth/users?page=1&limit=10
      const response = await api.get(`/auth/users?page=${page}&limit=10&keyword=${searchQuery}`);
      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(Math.ceil(response.data.count / 10));
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      // Backend should have DELETE /api/auth/users/:id
      await api.delete(`/auth/users/${userId}`);
      setUsers(users.filter(u => (u.id || (u as any)._id) !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Manage Users" 
        subtitle="View and manage user accounts and permissions"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
               <UsersIcon className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm text-muted-foreground">Total Accounts</p>
               <h3 className="text-2xl font-bold">{users.length}</h3>
            </div>
         </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <LoadingSpinner size="md" />
                  </td>
                </tr>
              ) : users.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {users.map((u) => {
                    const id = u.id || (u as any)._id;
                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{u.name || "Anonymous"}</p>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.role === "admin" 
                              ? "bg-purple-500/10 text-purple-600" 
                              : "bg-blue-500/10 text-blue-600"
                          }`}>
                            {u.role === "admin" && <ShieldCheck className="w-3.5 h-3.5" />}
                            {u.role?.toUpperCase() || "USER"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => handleDeleteUser(id)}
                               className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                               title="Delete User"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all">
                                <MoreVertical className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <tr>
                   <td colSpan={4} className="py-20 text-center text-muted-foreground">
                      No users found.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-border rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
