import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/UI/Footer";

import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default layout;
