import type { StaticImageData } from "next/image";
import groceryIcon from "@/src/assets/categories icons/grochery.png";
import vegetableIcon from "@/src/assets/categories icons/vegitable.png";
import fishIcon from "@/src/assets/categories icons/fish.png";
import dairyIcon from "@/src/assets/categories icons/dairy.png";
import frozenIcon from "@/src/assets/categories icons/frozen.png";
import fruitIcon from "@/src/assets/categories icons/fruit.png";
import householdIcon from "@/src/assets/categories icons/household.png";
import meatIcon from "@/src/assets/categories icons/meat.png";
import personalCareIcon from "@/src/assets/categories icons/personal_care.png";
import stationaryIcon from "@/src/assets/categories icons/stationary.png";



export type SubCategory = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  image: StaticImageData;
  subCategory?: SubCategory[];
};

export const categoriesData: Category[] = [
  {
    id: "fish",
    name: "Fish",
    image: fishIcon,
    subCategory : [
    { id: "freshwater", name: "Freshwater Fish" },
    { id: "saltwater", name: "Saltwater Fish" },
    { id: "shellfish", name: "Shellfish" },
  ],
  },
  {
    id: "meat",
    name: "Meat",
    image: meatIcon,
    subCategory: [
    { id: "beef", name: "Beef" },
    { id: "poultry", name: "Poultry" },
    { id: "lamb", name: "Lamb" },
  ],
   
  },
  {
    id: "fruits",
    name: "Fruits",
    image: fruitIcon,
    subCategory: [
      { id: "citrus", name: "Citrus Fruits" },
      { id: "berries", name: "Berries" },
      { id: "tropical", name: "Tropical Fruits" },
      { id: "stonefruits", name: "Stone Fruits" },
    ],
   
  },
  {
    id: "vegetables",
    name: "Vegetables",
    image: vegetableIcon,
    subCategory: [
      { id: "leafy", name: "Leafy Greens" },
      { id: "root", name: "Root Vegetables" },
      { id: "cruciferous", name: "Cruciferous Vegetables" },
      { id: "alliums", name: "Alliums" },
    ],
    
  },
  {
    id: "dairy",
    name: "Dairy",
    image: dairyIcon,
    subCategory: [
      { id: "milk", name: "Milk" },
      { id: "cheese", name: "Cheese" },
      { id: "yogurt", name: "Yogurt" },
      { id: "butter", name: "Butter" },
    ],
    
  },
  {
    id: "frozen",
    name: "Frozen",
    image: frozenIcon,
    subCategory: [
      { id: "vegetables", name: "Frozen Vegetables" },
      { id: "fruits", name: "Frozen Fruits" },
      { id: "meals", name: "Frozen Meals" },
      { id: "desserts", name: "Frozen Desserts" },
    ],
    
  },
  {
    id: "grocery",
    name: "Grocery",
    image: groceryIcon,
    subCategory: [
      { id: "cereals", name: "Cereals" },
      { id: "snacks", name: "Snacks" },
      { id: "condiments", name: "Condiments" },
      { id: "baking", name: "Baking Supplies" },
    ],
   
  },
  {
    id: "personalcare",
    name: "Personal Care",
    image: personalCareIcon,
    subCategory: [
      { id: "skincare", name: "Skincare" },
      { id: "haircare", name: "Haircare" },
      { id: "oralcare", name: "Oral Care" },
      { id: "bodycare", name: "Body Care" },
    ],
   
  },
  {
    id: "household",
    name: "House Hold",
    image: householdIcon,
   
  },
  {
    id: "stationery",
    name: "Stationery",
    image: stationaryIcon,
   
  },
];

