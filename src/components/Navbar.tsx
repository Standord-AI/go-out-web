"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Image src="/logo/logo-long.png" alt="GoOut" width={100} height={32} />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl"
        >
          <FiMenu />
        </button>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm">
            Log in
          </Button>
          <Button size="sm">Sign up</Button>
        </div>
      </div>

      {/* Sliding Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
            />

            {/* Sidebar Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r p-6 flex flex-col gap-6 md:hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end text-2xl"
              >
                <FiX />
              </button>

              {/* Navigation Links */}
              <NavLinks />

              {/* Auth Buttons */}
              <Button variant="outline" size="sm">
                Log in
              </Button>
              <Button size="sm">Sign up</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* Extracted Navigation Links */
function NavLinks() {
  return (
    <>
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/experiences"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Experiences
      </Link>
      <Link
        href="/locations"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Locations
      </Link>
      <Link
        href="/gift-ideas"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Gift Ideas
      </Link>
    </>
  );
}
