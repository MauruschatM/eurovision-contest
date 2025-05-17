"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useState } from "react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-white bg-opacity-60 backdrop-blur-lg shadow-lg fixed w-full z-10 border-b border-white border-opacity-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-pink-500 text-2xl font-bold hover:text-pink-400 transition-colors duration-300 tracking-wider"
              style={{ textShadow: "0 0 8px rgba(255, 0, 255, 0.7)" }}
            >
              ESC Tippspiel
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="space-x-2">
              <NavLink href="/" current={pathname === "/"}>
                Meine Tipps
              </NavLink>
              <NavLink
                href="/all-predictions"
                current={pathname === "/all-predictions"}
              >
                Alle Tipps
              </NavLink>
              <NavLink href="/results" current={pathname === "/results"}>
                Ergebnisse
              </NavLink>
              {user.is_admin && (
                <NavLink href="/admin" current={pathname === "/admin"}>
                  Admin
                </NavLink>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-slate-700 font-medium">
                Hallo, {user.name}
              </span>
              <button
                onClick={logout}
                className="text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
                style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.7)" }}
              >
                Abmelden
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 p-2 rounded-md"
              aria-label="Menü öffnen"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-8 6h8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-lg border-t border-white border-opacity-20 shadow-xl">
          <div className="flex flex-col items-stretch space-y-1 px-2 pt-2 pb-3">
            <NavLink
              href="/"
              current={pathname === "/"}
              additionalClassName="w-full text-left"
            >
              Meine Tipps
            </NavLink>
            <NavLink
              href="/all-predictions"
              current={pathname === "/all-predictions"}
              additionalClassName="w-full text-left"
            >
              Alle Tipps
            </NavLink>
            <NavLink
              href="/results"
              current={pathname === "/results"}
              additionalClassName="w-full text-left"
            >
              Ergebnisse
            </NavLink>
            {user.is_admin && (
              <NavLink
                href="/admin"
                current={pathname === "/admin"}
                additionalClassName="w-full text-left"
              >
                Admin
              </NavLink>
            )}
            <div className="pt-3 mt-2 border-t border-slate-200 w-full">
              <div className="px-3 mb-2">
                <span className="block text-slate-700 font-medium text-sm">
                  Hallo, {user.name}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-white bg-pink-500 hover:bg-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
                style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.7)" }}
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

type NavLinkProps = {
  href: string;
  current: boolean;
  children: React.ReactNode;
  additionalClassName?: string;
};

const NavLink: React.FC<NavLinkProps> = ({
  href,
  current,
  children,
  additionalClassName = "",
}) => {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out group relative ${additionalClassName} 
        ${
          current
            ? "bg-pink-500 text-white shadow-lg transform scale-105 hover:bg-pink-600"
            : "text-slate-700 hover:bg-gray-200 hover:bg-opacity-80 hover:text-pink-500"
        }`}
    >
      {children}
      {current && (
        <span
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-pink-400 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: "0 0 10px rgba(255, 0, 255, 0.9)" }}
        ></span>
      )}
    </Link>
  );
};
