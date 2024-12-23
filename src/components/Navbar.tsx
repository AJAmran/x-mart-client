"use client";

import React, { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-primary text-white">
      {/* Top Section */}
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center bg-white p-1">
          <Image
            src="/logo.png"
            alt="X-Mart Logo"
            className="h-12 w-12"
            height={48}
            width={48}
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex space-x-8">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>

          <Link href="/products" className="hover:text-accent">
            Products
          </Link>

          <Link href="/about" className="hover:text-accent">
            About
          </Link>

          <Link href="/contact" className="hover:text-accent">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 text-black rounded-md outline-none"
            />
          </div>

          {/* Cart */}

          <Link href="/cart" className="relative flex items-center">
            <AiOutlineShoppingCart size={24} />
            <span className="absolute top-0 right-0 text-xs bg-accent text-black rounded-full px-2">
              3
            </span>
          </Link>

          {/* User Account */}

          <Link href="/auth/login">
            <AiOutlineUser size={24} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-secondary">
          <ul className="flex flex-col space-y-4 px-4 py-6">
            <li>
              <Link
                href="/"
                className="hover:text-accent"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-accent"
                onClick={toggleMobileMenu}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-accent"
                onClick={toggleMobileMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-accent"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
