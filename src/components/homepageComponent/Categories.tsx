import { categoriesData } from "@/src/data/CategoriesData";
import CategoriesClient from "./CategoriesClient";
import { Section, SectionHeading } from "@/src/components/UI/Section";

export default function Categories() {
  return (
    <Section spacing="md">
      <SectionHeading
        align="center"
        description="Ten departments, one basket. Pick a department to narrow the range."
        title="Shop by category"
      />
      <div className="mt-12">
        <CategoriesClient categories={categoriesData} />
      </div>
    </Section>
  );
}