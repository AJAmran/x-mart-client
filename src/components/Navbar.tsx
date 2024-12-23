"use client";

import React, { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineHeart,
} from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io"; // Importing dropdown icon
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleCategoryMenu = () => setCategoryMenuOpen(!categoryMenuOpen);

  return (
    <header className="bg-primary text-white">
      {/* Top Section */}
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center">
          <Image
            src="/logo.png"
            alt="X-Mart Logo"
            className="h-12 w-12 bg-white p-1"
            height={48}
            width={48}
          />
          <span className="ml-2">X-Mart</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex space-x-6">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>

          <div
            className="relative group"
            onMouseEnter={() => setCategoryMenuOpen(true)}
            onMouseLeave={() => setCategoryMenuOpen(false)}
          >
            <button
              onClick={toggleCategoryMenu}
              className="flex items-center hover:text-accent focus:outline-none"
            >
              Categories
              <IoMdArrowDropdown size={18} className="ml-2" />{" "}
              {/* Dropdown icon */}
            </button>
            {/* Dropdown */}
            {categoryMenuOpen && (
              <div className="absolute z-10 bg-white text-black rounded-md shadow-lg mt-[2px]">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/categories/electronics"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/fashion"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Fashion
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/home"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Home Appliances
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/books"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Books
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/sports"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Sports
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

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
          <div className="hidden md:flex items-center bg-white text-black rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 outline-none w-48"
            />
            <button className="bg-accent px-4 py-2">Search</button>
          </div>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative flex items-center">
            <AiOutlineHeart size={24} />
            <span className="absolute -top-1 -right-3 text-xs bg-accent text-black rounded-full px-2">
              5
            </span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center">
            <AiOutlineShoppingCart size={24} />
            <span className="absolute -top-1 -right-3 text-xs bg-accent text-black rounded-full px-2">
              3
            </span>
          </Link>

          {/* User Account */}
          <Link href="/auth/login" className="flex items-center space-x-1">
            <AiOutlineUser size={24} />
            <span>Login</span>
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
                href="/categories"
                className="hover:text-accent"
                onClick={toggleMobileMenu}
              >
                Categories
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
