import { categoriesData } from "@/src/data/CategoriesData";
import CategoriesDropdownClient from "./CategoriesDropdownClient";


export default function CategoriesDropdownContainer() {
  return (
    <CategoriesDropdownClient
      buttonText="Categories"
      categories={categoriesData}
    />
  );
}
