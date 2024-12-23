import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-primary text-white px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-lg font-bold">X-Mart</Link>
      <ul className="flex space-x-4">
        <Link href="/">Home</Link>
        <Link href="/product">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/admin">Admin</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
