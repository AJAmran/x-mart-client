"use client";

import { Link } from "@nextui-org/link";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "../icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12 shadow-md">
      <div className="container mx-auto px-6 md:px-10">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">About X-Mart</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              X-Mart is your one-stop destination for all your shopping needs. From groceries to electronics, we provide quality products at competitive prices.
            </p>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Customer Support</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and promotions.
            </p>
            <form className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-auto shadow-md dark:text-gray-900"
                required
              />
              <Button type="submit" className="bg-primary shadow-md text-white px-4 py-2 rounded">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Social Media Links */}
          <div className="flex justify-center lg:justify-start space-x-4">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
              <FacebookIcon size={24} />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
              <TwitterIcon size={24} />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
              <InstagramIcon size={24} />
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
              <LinkedInIcon size={24} />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center lg:text-left">
            © {new Date().getFullYear()} X-Mart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
