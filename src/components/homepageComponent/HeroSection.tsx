import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function HeroSection() {
  const heroItems = [
    {
      href: "/shop?category=VEGETABLES",
      title: "Fresh Produce",
      subtitle: "Daily Fresh Fruits & Vegetables",
      image: "https://i.ibb.co.com/JpnqkVN/Daily-Fresh-Fruits-Vegetables.jpg",
      alt: "Fresh Produce",
    },
    {
      href: "/shop?search=hot%20deals",
      title: "Hot Deals",
      subtitle: "Save up to 50% on Essentials",
      image: "https://i.ibb.co.com/2dvNHTt/Save-up-to-50-on-Essentials.jpg",
      alt: "Hot Deals",
    },
    {
      href: "/shop?category=HOUSEHOLD",
      title: "New Arrivals",
      subtitle: "Trendy Kitchen Gadgets",
      image: "https://i.ibb.co.com/8xCT9RF/Trendy-Kitchen-Gadgets.jpg",
      alt: "New Arrivals",
    },
    {
      href: "/shop?search=smart%20blender",
      title: "Featured Product",
      subtitle: "Smart Blender",
      image: "https://i.ibb.co.com/kMQpNqy/Smart-Blender.jpg",
      alt: "Smart Blender",
      footer: (
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-tiny">Only $99.99</p>
            <p className="text-black text-tiny">Free Shipping Available</p>
          </div>
          <Button
            className="text-tiny"
            color="primary"
            radius="full"
            size="sm"
            aria-label="Shop Smart Blender"
          >
            Shop Now
          </Button>
        </CardFooter>
      ),
    },
    {
      href: "/shop",
      title: "Mobile App",
      subtitle: "Shop Anytime, Anywhere",
      image: "https://i.ibb.co.com/Yb0zqHR/Shop-Anytime.jpg",
      alt: "Mobile App Promo",
      footer: (
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 items-center">
            <Image
              alt="App Icon"
              className="rounded-full w-10 h-11 bg-black"
              src="https://via.placeholder.com/50?text=App+Icon"
              width={40}
              height={44}
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">Get our app</p>
              <p className="text-tiny text-white/60">Exclusive deals await!</p>
            </div>
          </div>
          <Button radius="full" size="sm" aria-label="Download X-mart App">
            Download
          </Button>
        </CardFooter>
      ),
    },
  ];

  return (
    <section
      className="gap-4 grid grid-cols-12 grid-rows-2 mt-10"
      aria-label="Promotional Banners"
    >
      {heroItems.map((item, index) => (
        <Link
          key={index}
          className={`col-span-12 ${
            index === 3
              ? "sm:col-span-5"
              : index === 4
                ? "sm:col-span-7"
                : "sm:col-span-4"
          } h-[300px]`}
          href={item.href}
        >
          <Card
            className="w-full h-full"
            isFooterBlurred={!!item.footer}
            isHoverable
            radius="lg"
          >
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                {item.title}
              </p>
              <h4
                className={`font-medium text-large ${
                  item.title === "Featured Product"
                    ? "text-black"
                    : "text-white"
                }`}
              >
                {item.subtitle}
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt={item.alt}
              className={`z-0 w-full h-full object-cover ${
                item.title === "Featured Product"
                  ? "scale-125 -translate-y-6"
                  : ""
              }`}
              src={item.image}
              width={600}
              height={300}
            />
            {item.footer}
          </Card>
        </Link>
      ))}
    </section>
  );
}
