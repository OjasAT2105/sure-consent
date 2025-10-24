import React from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./AdminApp";
import "./admin.css";

// Initialize React app when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("sureconsent-admin-root");
  if (container) {
    const root = createRoot(container);
    root.render(<AdminApp />);
  }
});
