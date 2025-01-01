import type { StaticImageData } from "next/image";
import groceriesicon from "@/src/assets/categories icons/grocery.png";
import vegetablesicons from "@/src/assets/categories icons/vegetable.png";
import fruitsicon from "@/src/assets/categories icons/fruits.png";
import dairyicons from "@/src/assets/categories icons/dairy.png";
import beveragesicons from "@/src/assets/categories icons/drink.png";
import meat_fish from "@/src/assets/categories icons/protein.png";

export type Subcategory = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  image: StaticImageData; // Updated to match the type of imported images
  subcategories: Subcategory[];
};

export const categoriesData: Category[] = [
  {
    id: "groceries",
    name: "Groceries",
    image: groceriesicon,
    subcategories: [
      { id: "rice-flour", name: "Rice & Flour" },
      { id: "oil-spices", name: "Oil & Spices" },
      { id: "pulses", name: "Pulses" },
      { id: "snacks", name: "Snacks" },
    ],
  },
  {
    id: "vegetables",
    name: "Vegetables",
    image: vegetablesicons,
    subcategories: [
      { id: "leafy", name: "Leafy Vegetables" },
      { id: "root", name: "Root Vegetables" },
    ],
  },
  {
    id: "fruits",
    name: "Fruits",
    image: fruitsicon,
    subcategories: [
      { id: "seasonal-fruits", name: "Seasonal Fruits" },
      { id: "dry-fruits", name: "Dry Fruits" },
    ],
  },
  {
    id: "dairy",
    name: "Dairy Products",
    image: dairyicons,
    subcategories: [
      { id: "milk", name: "Milk" },
      { id: "cheese", name: "Cheese" },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    image: beveragesicons,
    subcategories: [
      { id: "tea-coffee", name: "Tea & Coffee" },
      { id: "juices", name: "Juices" },
    ],
  },
  {
    id: "meat-fish",
    name: "Meat & Fish",
    image: meat_fish,
    subcategories: [
      { id: "fresh-meat", name: "Fresh Meat" },
      { id: "seafood", name: "Seafood" },
    ],
  },
];
