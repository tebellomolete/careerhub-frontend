"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: "Find Jobs" },
    { href: "/dashboard/listings", label: "Employer Dashboard" },
  ];

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
    </ul>
  );
}
