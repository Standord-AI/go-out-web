"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CartIcon } from "./CartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DoorOpen, User } from "lucide-react";
import { Card } from "./ui/card";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Link href="/">
          <Image
            src="/logo/logo-long.png"
            alt="GoOut"
            width={100}
            height={32}
          />
        </Link>

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
          <CartIcon />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user.firstName} />
                  <AvatarFallback>
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[240px]"
                sideOffset={10}
                align="end"
              >
                <div className="flex items-center gap-4 p-2">
                  <Avatar>
                    <AvatarImage src={user.firstName} />
                    <AvatarFallback>
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="relative flex w-full max-w-[140px] flex-col">
                    <span className="line-clamp-1 block truncate font-semibold">
                      {user.firstName}&nbsp;{user.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link className="text-muted-foreground" href="/profile">
                      <User className="size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer p-0" asChild>
                    <button
                      className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-accent-foreground focus:bg-accent [&>svg]:size-4 [&>svg]:shrink-0"
                      onClick={logout}
                    >
                      <DoorOpen />
                      Sign out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </>
          )}
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

              {/* Cart and Auth Buttons */}
              <CartIcon className="w-full" />
              {user ? (
                <Card className="p-1">
                  <div className="flex items-center gap-2 p-1 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={user.firstName} />
                      <AvatarFallback>
                        {user.firstName.charAt(0).toUpperCase()}
                        {user.lastName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">
                      {user.firstName}&nbsp;{user.lastName}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 px-2 py-2">
                    <Button asChild variant="secondary" size="sm">
                    <Link href="/profile" onClick={() => setMenuOpen(false)}>
                      <User /> Profile
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={logout}
                  >
                    <DoorOpen /> Sign Out
                  </Button>
                  </div>
                </Card>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link
                      href="/auth/signup"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
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
      {/* <Link
        href="/gift-ideas"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Gift Ideas
      </Link> */}
    </>
  );
}
