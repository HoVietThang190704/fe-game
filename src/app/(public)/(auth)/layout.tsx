import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
      <div style={{ width: 420, maxWidth: "100%" }}>{children}</div>
    </div>
  );
}
