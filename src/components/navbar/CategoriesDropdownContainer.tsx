import { categoriesData } from "@/src/data/CategoriestData";
import CategoriesDropdownClient from "./CategoriesDropdownClient";


export default function CategoriesDropdownContainer() {
  return (
    <CategoriesDropdownClient
      categories={categoriesData}
      buttonText="Categories"
    />
  );
}