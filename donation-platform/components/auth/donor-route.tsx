"use client"

import ProtectedRoute from "./protected-route"

export default function DonorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["user", "donor"]}>
      {children}
    </ProtectedRoute>
  )
} 