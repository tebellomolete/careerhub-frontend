"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleSignOut } from "@/app/actions/auth";

interface NavLinksProps {
  user?: {
    name?: string | null;
    role?: string;
  };
}

export default function NavLinks({ user }: NavLinksProps) {
  const pathname = usePathname();

  const links = [];
  
  if (user?.role === "candidate") {
    links.push({ href: "/jobs", label: "Jobs" });
  } else if (user?.role === "employer") {
    links.push({ href: "/dashboard/listings", label: "Dashboard" });
  }

  return (
    <ul className="flex items-center gap-6">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}

      {!user ? (
        <li>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Sign In
          </Link>
        </li>
      ) : (
        <li className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.name}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              user.role === "employer" 
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            }`}>
              {user.role === "employer" ? "Employer" : "Candidate"}
            </span>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </li>
      )}
    </ul>
  );
}
