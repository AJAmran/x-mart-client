import { title } from "@/src/components/primitives";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-24 md:py-32 text-center">
        <h1 className={title()}>Blog</h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          Stay tuned for exciting articles, tips, and updates from X-Mart.
        </p>
        <div className="mt-16 flex flex-col items-center gap-8">
          <Image
            alt="Coming soon illustration"
            className="opacity-80"
            height={300}
            src="/images/blog-placeholder.jpg"
            width={400}
          />
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              We&apos;re working on bringing you the best content about
              products, lifestyle tips, and exclusive offers. Subscribe to
              our newsletter to be the first to know!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
