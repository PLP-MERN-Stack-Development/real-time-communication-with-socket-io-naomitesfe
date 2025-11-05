"use client";
import { useState, useEffect } from "react";

export function SignOutButton({ onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    onLogout(); // notify parent to reset user state
  };

  if (!isAuthenticated) return null;

  return (
    <button
      className="px-4 py-2 rounded bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
}
