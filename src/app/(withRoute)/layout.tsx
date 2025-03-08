import Footer from "@/src/components/UI/Footer";
import { Navbar } from "@/src/components/UI/navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto px-6 md:px-10 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default layout;
