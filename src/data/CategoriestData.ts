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

import { Product } from "../types";

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

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Carrot - 1kg",
    price: 275, // Converted to BDT
    discount: 10, // 10% discount
    imageUrl:
      "https://static.vecteezy.com/system/resources/previews/045/931/894/non_2x/fresh-organic-carrots-with-green-tops-free-png.png",
    category: "Groceries",
    subCategory: "Vegetables",
    inStock: false,
    description: "Fresh organic carrots.",
    rating: 4.5,
    reviews: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Tomato - 1kg",
    price: 198, // Converted to BDT
    discount: 5, // 5% discount
    imageUrl:
      "https://vendor.shaqexpress.com/storage/16747/conversions/eHgvaW2eamMvUyEJBxKmLUkPrbCfsl-metaMTM3MTYxNjM1MTE1MC1yZW1vdmViZy1wcmV2aWV3LnYxICgxKS5wbmc=--small.png",
    category: "Groceries",
    subCategory: "Vegetables",
    inStock: true,
    description: "Fresh tomatoes, perfect for cooking.",
    rating: 4.2,
    reviews: 98,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Banana - 1 bunch",
    price: 132, // Converted to BDT
    discount: 0, // No discount
    imageUrl:
      "https://cdn.tridge.com/attachment-file/b9/d3/08/b9d30896c15d86ee95f2803c86e0a0448528037e/banana__bigImage.png",
    category: "Groceries",
    subCategory: "Fruits",
    inStock: true,
    description: "Ripe bananas, great for smoothies.",
    rating: 4.7,
    reviews: 210,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Apple - 1kg",
    price: 220, // Converted to BDT
    discount: 5, // 5% discount
    imageUrl:
      "https://png.pngtree.com/png-vector/20240205/ourmid/pngtree-group-of-red-apple-fruits-png-image_11625188.png",
    category: "Groceries",
    subCategory: "Fruits",
    inStock: true,
    description: "Crisp and fresh apples.",
    rating: 4.6,
    reviews: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Whole Milk - 1L",
    price: 165, // Converted to BDT
    discount: 10, // 10% discount
    imageUrl:
      "https://paulsdairy.com/sites/default/files/2PARI3290_Paul_Int_UHT_1L_FullCream_HARV_1407_8113442_ART_Eng3D.png",
    category: "Groceries",
    subCategory: "Dairy Products",
    inStock: true,
    description: "Fresh whole milk, great for tea or coffee.",
    rating: 4.4,
    reviews: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Cheddar Cheese - 250g",
    price: 440, // Converted to BDT
    discount: 15, // 15% discount
    imageUrl:
      "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6ImRkOTY1MzY2MWRjOGE1NWJjMTY4NTU5ZmZhZDljMmM1Iiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=9da537cacfa4c0c514c24835a5d85416c672c6c5ca8c3703a0341b9416d99d48",
    category: "Groceries",
    subCategory: "Dairy Products",
    inStock: true,
    description: "Sharp cheddar cheese, perfect for sandwiches.",
    rating: 4.8,
    reviews: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Green Tea - 50g",
    price: 330, // Converted to BDT
    discount: 5, // 5% discount
    imageUrl:
      "https://wallpapers.com/images/featured/green-tea-png-dz5xftzwuc96jo77.jpg",
    category: "Groceries",
    subCategory: "Beverages",
    inStock: true,
    description: "Refreshing green tea leaves.",
    rating: 4.3,
    reviews: 180,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Coffee Beans - 250g",
    price: 550, // Converted to BDT
    discount: 20, // 20% discount
    imageUrl:
      "https://cdn.gardengrocer.com/attachments/photos/big/1614.png?4374",
    category: "Groceries",
    subCategory: "Beverages",
    inStock: true,
    description: "Premium coffee beans, perfect for brewing.",
    rating: 4.9,
    reviews: 300,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    name: "Chicken Breast - 500g",
    price: 660, // Converted to BDT
    discount: 15, // 15% discount
    imageUrl:
      "https://png.pngtree.com/png-vector/20240421/ourmid/pngtree-vector-art-of-three-raw-chicken-breasts-on-a-plate-accompanied-png-image_12303628.png",
    category: "Groceries",
    subCategory: "Meat & Fish",
    inStock: true,
    description: "Fresh chicken breast, great for grilling.",
    rating: 4.7,
    reviews: 220,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    name: "Salmon Fillet - 200g",
    price: 935, // Converted to BDT
    discount: 20, // 20% discount
    imageUrl:
      "https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-sliced-raw-salmon-fillet-png-file-png-image_11490817.png",
    category: "Groceries",
    subCategory: "Meat & Fish",
    inStock: true,
    description: "Fresh salmon fillets, rich in omega-3.",
    rating: 4.8,
    reviews: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    name: "Lettuce - 1 head",
    price: 110, // Converted to BDT
    discount: 5, // 5% discount
    imageUrl:
      "https://www.pngall.com/wp-content/uploads/15/Lettuce-PNG-HD-Image.png",
    category: "Groceries",
    subCategory: "Vegetables",
    inStock: true,
    description: "Crisp and fresh lettuce for salads.",
    rating: 4.4,
    reviews: 130,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    name: "Strawberries - 250g",
    price: 385, // Converted to BDT
    discount: 10, // 10% discount
    imageUrl:
      "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6ImMyMzc2ZDE2NDIzMGM4OGMyOWY4NDdlOWFmZjA1M2FhIiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=31ac2ac73787e5e92cdef87756fec7902c895b3c24c9d9d61e3a5b2f544408dc",
    category: "Groceries",
    subCategory: "Fruits",
    inStock: true,
    description: "Sweet and juicy strawberries.",
    rating: 4.6,
    reviews: 175,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
