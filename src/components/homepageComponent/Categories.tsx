import { categoriesData } from "@/src/data/CategoriesData";
import CategoriesClient from "./CategoriesClient";

export default function Categories() {
  return (
    <section aria-label="Shop by Categories" className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
          Shop by Categories
        </h2>
        <p className="mt-2 text-sm lg:text-base">
          Discover a wide range of products tailored to your needs.
        </p>
      </div>
      <CategoriesClient categories={categoriesData} />
    </section>
  );
}
