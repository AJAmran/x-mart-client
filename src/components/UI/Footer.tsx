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
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/help">
                  Help Center
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/returns">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/shipping">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/faq">
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
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/products">
                  Shop
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition" href="/contact">
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
                required
                className="w-full sm:w-auto shadow-md dark:text-gray-900"
                placeholder="Enter your email"
                type="email"
              />
              <Button className="bg-primary shadow-md text-white px-4 py-2 rounded" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Social Media Links */}
          <div className="flex justify-center lg:justify-start space-x-4">
            <Link className="text-gray-600 dark:text-gray-400 hover:text-primary transition" href="https://facebook.com" rel="noopener noreferrer" target="_blank">
              <FacebookIcon size={24} />
            </Link>
            <Link className="text-gray-600 dark:text-gray-400 hover:text-primary transition" href="https://twitter.com" rel="noopener noreferrer" target="_blank">
              <TwitterIcon size={24} />
            </Link>
            <Link className="text-gray-600 dark:text-gray-400 hover:text-primary transition" href="https://instagram.com" rel="noopener noreferrer" target="_blank">
              <InstagramIcon size={24} />
            </Link>
            <Link className="text-gray-600 dark:text-gray-400 hover:text-primary transition" href="https://linkedin.com" rel="noopener noreferrer" target="_blank">
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
