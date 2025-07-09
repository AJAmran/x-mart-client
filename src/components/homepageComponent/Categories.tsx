import { categoriesData } from "@/src/data/CategoriestData";
import CategoriesClient from "./CategoriesClient";

export default function Categories() {
  return (
    <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8" aria-label="Shop by Categories">
      <div className="text-center mb-12">
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
          Shop by Categories
        </h1>
        <p className="mt-2 text-sm lg:text-base">
          Discover a wide range of products tailored to your needs.
        </p>
      </div>
      <CategoriesClient categories={categoriesData} />
    </section>
  );
}