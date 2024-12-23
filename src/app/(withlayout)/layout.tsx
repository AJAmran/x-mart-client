import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Componentslayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
