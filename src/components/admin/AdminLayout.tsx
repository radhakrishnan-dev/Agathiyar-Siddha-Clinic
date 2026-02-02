import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Leaf } from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Loading */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-herbal">
        <div className="animate-pulse flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-lg text-primary">Loading...</span>
        </div>
      </div>
    );
  }

  /* Not Logged In */
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  /* Not Admin */
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-herbal p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-xl font-serif font-semibold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-4">
            You do not have admin privileges. Please contact the administrator to
            request access.
          </p>
          <a href="/" className="text-primary hover:underline">
            Return to Website
          </a>
        </div>
      </div>
    );
  }

  /* Admin Layout */
  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Right Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;
