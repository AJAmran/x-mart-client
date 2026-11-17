import { TProduct, TOrder, ORDER_STATUS } from "@/src/types";

/**
 * Generates 1,000 realistic, representative product records
 * to benchmark DOM Virtualization (Requirement 3).
 */
export function generate1000Products(): TProduct[] {
  const categories = [
    "ELECTRONICS",
    "FASHION",
    "HOME_AND_LIVING",
    "BEAUTY",
    "SPORTS",
    "BOOKS",
    "GROCERY",
  ];
  const statuses = ["PUBLISHED", "DRAFT", "ARCHIVED"];
  const adjectives = [
    "Wireless",
    "Ergonomic",
    "Ultra-Fast",
    "Eco-Friendly",
    "Premium",
    "Pro",
    "Compact",
    "Smart",
    "Heavy-Duty",
    "Portable",
  ];
  const nouns = [
    "Headphones",
    "Mechanical Keyboard",
    "Monitor",
    "Running Shoes",
    "Coffee Maker",
    "Backpack",
    "Desk Lamp",
    "Air Purifier",
    "Smartwatch",
    "USB-C Hub",
  ];

  return Array.from({ length: 1000 }, (_, index) => {
    const id = `bench-prod-${index + 1}`;
    const adj = adjectives[index % adjectives.length];
    const noun = nouns[(index * 7) % nouns.length];
    const category = categories[index % categories.length];
    const status = statuses[index % statuses.length];
    const price = 15 + ((index * 37) % 850);
    const stock = (index * 13) % 150;

    return {
      _id: id,
      name: `${adj} ${noun} ${index + 1}`,
      slug: `product-${index + 1}`,
      price,
      status,
      category,
      description: `High performance grade ${adj.toLowerCase()} ${noun.toLowerCase()} built for reliability and daily use.`,
      inventories: [{ stock, branchId: "main-branch" }],
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"],
      createdAt: new Date(Date.now() - index * 3600000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as TProduct;
  });
}

/**
 * Generates 1,000 realistic, representative order records
 * to benchmark DOM Virtualization in Order Management (Requirement 3).
 */
export function generate1000Orders(): TOrder[] {
  const statuses = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
  ];
  const cities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal"];
  const names = [
    "Amran Hossen",
    "Rahim Ahmed",
    "Karim Ullah",
    "Sadia Islam",
    "Tanvir Hasan",
    "Nusrat Jahan",
    "Farhan Kabir",
    "Tahmina Akter",
  ];

  return Array.from({ length: 1000 }, (_, index) => {
    const id = `ord-${(100000 + index).toString(16)}`;
    const status = statuses[index % statuses.length];
    const customer = names[index % names.length];
    const city = cities[index % cities.length];
    const price = 45 + ((index * 73) % 2400);

    return {
      _id: id,
      userId: `usr-${1000 + (index % 50)}`,
      totalPrice: price,
      status,
      paymentMethod: index % 2 === 0 ? "ONLINE" : "CASH",
      paymentStatus: status === ORDER_STATUS.DELIVERED ? "PAID" : "PENDING",
      shippingInfo: {
        name: customer,
        city,
        address: `${10 + (index % 80)} Main Avenue, Ward ${1 + (index % 12)}`,
        phone: `+8801700${(100000 + index).toString().slice(-6)}`,
      },
      orderItems: [],
      createdAt: new Date(Date.now() - index * 1800000).toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as TOrder;
  });
}
