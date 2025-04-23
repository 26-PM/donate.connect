"use client"

import ProtectedRoute from "./protected-route"

export default function NGORoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ngo"]}>
      {children}
    </ProtectedRoute>
  )
} 