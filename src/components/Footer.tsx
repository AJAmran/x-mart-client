import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmazonPay,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      {/* Top Section */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 py-12">
        {/* About Section */}
        <div>
          <h4 className="text-lg font-bold mb-4">About X-Mart</h4>
          <p className="text-gray-100 text-md">
            X-Mart is your one-stop destination for all daily essentials,
            groceries, electronics, and more. We are committed to providing
            quality products and exceptional customer service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-accent transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-accent transition">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-accent transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-bold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/returns" className="hover:text-accent transition">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-accent transition">
                Shipping Information
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-accent transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-accent transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>Phone: +880 123-456-789</li>
            <li>Email: support@xmart.com</li>
            <li>Address: 123 Main Street, Dhaka, Bangladesh</li>
          </ul>
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4">
            <Link
              href="#"
              aria-label="Facebook"
              className="text-white hover:text-accent transition"
            >
              <FaFacebookF size={20} />
            </Link>
            <Link
              href="#"
              aria-label="Twitter"
              className="text-white hover:text-accent transition"
            >
              <FaTwitter size={20} />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="text-white hover:text-accent transition"
            >
              <FaInstagram size={20} />
            </Link>
            <Link
              href="#"
              aria-label="YouTube"
              className="text-white hover:text-accent transition"
            >
              <FaYoutube size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-primary py-4 text-center text-sm">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Payment Methods */}
          <div className="flex space-x-4">
            <FaCcVisa size={24} />
            <FaCcMastercard size={24} />
            <FaCcPaypal size={24} />
            <FaCcAmazonPay size={24} />
          </div>

          {/* Copyright */}
          <p className="text-white">
            &copy; {new Date().getFullYear()} X-Mart. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
