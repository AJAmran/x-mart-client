// categoriesData.ts
export type Subcategory = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

export const categoriesData: Category[] = [
  {
    id: "groceries",
    name: "Groceries",
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
    subcategories: [
      { id: "leafy", name: "Leafy Vegetables" },
      { id: "root", name: "Root Vegetables" },
    ],
  },
  {
    id: "fruits",
    name: "Fruits",
    subcategories: [
      { id: "seasonal-fruits", name: "Seasonal Fruits" },
      { id: "dry-fruits", name: "Dry Fruits" },
    ],
  },
  {
    id: "dairy",
    name: "Dairy Products",
    subcategories: [
      { id: "milk", name: "Milk" },
      { id: "cheese", name: "Cheese" },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    subcategories: [
      { id: "tea-coffee", name: "Tea & Coffee" },
      { id: "juices", name: "Juices" },
    ],
  },
  {
    id: "meat-fish",
    name: "Meat & Fish",
    subcategories: [
      { id: "fresh-meat", name: "Fresh Meat" },
      { id: "seafood", name: "Seafood" },
    ],
  },
];
