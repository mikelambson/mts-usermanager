"use client";
// app/components/Navbar.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../lib/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full p-4 bg-gray-900 dark:bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">MTS User Manager</h1>
        </Link>
        <div className="flex gap-4">
          <Link href="/" passHref>
            <Button variant="ghost" asChild>
              <span>Home</span>
            </Button>
          </Link>
          <Link href="/users" passHref>
            <Button variant="ghost" asChild>
              <span>User Management</span>
            </Button>
          </Link>
          <Link href="/companies" passHref>
            <Button variant="ghost" asChild>
              <span>Companies</span>
            </Button>
          </Link>
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "light" ? (
              <FaSun className="w-5 h-5" />
            ) : (
              <FaMoon className="w-5 h-5" />
            )}
            <span className="ml-2">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
