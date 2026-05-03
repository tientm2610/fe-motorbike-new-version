import { AdminLayout } from "@/components/layout/admin/admin-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}