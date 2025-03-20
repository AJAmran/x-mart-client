"use client";

import { Button } from "@nextui-org/button";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";
export default function HeroSection() {
  return (
    <div className="gap-4 grid grid-cols-12 grid-rows-2 mt-10">
      {/* Category Card */}
      <Link
        className="col-span-12 sm:col-span-4 h-[300px]"
        href="/shop?category=FRESH_PRODUCE"
      >
        <Card className="w-full h-full">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Fresh Produce
            </p>
            <h4 className="text-white font-medium text-large">
              Daily Fresh Fruits & Vegetables
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Fresh Produce"
            className="z-0 w-full h-full object-cover"
            src="https://i.ibb.co.com/JpnqkVN/Daily-Fresh-Fruits-Vegetables.jpg"
          />
        </Card>
      </Link>

      {/* Deals Card */}
      <Link
        className="col-span-12 sm:col-span-4 h-[300px]"
        href="/shop?search=hot%20deals" 
      >
        <Card className="w-full h-full">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Hot Deals
            </p>
            <h4 className="text-white font-medium text-large">
              Save up to 50% on Essentials
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Hot Deals"
            className="z-0 w-full h-full object-cover"
            src="https://i.ibb.co.com/2dvNHTt/Save-up-to-50-on-Essentials.jpg"
          />
        </Card>
      </Link>

      {/* New Arrivals */}
      <Link
        href="/shop?category=KITCHEN_GADGETS" 
        className="col-span-12 sm:col-span-4 h-[300px]"
      >
        <Card className="w-full h-full">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              New Arrivals
            </p>
            <h4 className="text-white font-medium text-large">
              Trendy Kitchen Gadgets
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="New Arrivals"
            className="z-0 w-full h-full object-cover"
            src="https://i.ibb.co.com/8xCT9RF/Trendy-Kitchen-Gadgets.jpg"
          />
        </Card>
      </Link>

      {/* Featured Product */}
      <Link
        className="w-full h-[300px] col-span-12 sm:col-span-5"
        href="/shop?search=smart%20blender" 
      >
        <Card isFooterBlurred className="w-full h-full">
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Featured Product
            </p>
            <h4 className="text-black font-medium text-2xl">Smart Blender</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Smart Blender"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src="https://i.ibb.co.com/kMQpNqy/Smart-Blender.jpg"
          />
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
            >
              Shop Now
            </Button>
          </CardFooter>
        </Card>
      </Link>

      {/* App Promo */}
      <Link
        href="/shop" // Navigate to the shop page without filters
        className="w-full h-[300px] col-span-12 sm:col-span-7"
      >
        <Card isFooterBlurred className="w-full h-full">
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Mobile App
            </p>
            <h4 className="text-white/90 font-medium text-xl">
              Shop Anytime, Anywhere
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Mobile App Promo"
            className="z-0 w-full h-full object-cover"
            src="https://i.ibb.co.com/Yb0zqHR/Shop-Anytime.jpg"
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <Image
                alt="App Icon"
                className="rounded-full w-10 h-11 bg-black"
                src="https://via.placeholder.com/50?text=App+Icon"
              />
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">Get our app</p>
                <p className="text-tiny text-white/60">
                  Exclusive deals await!
                </p>
              </div>
            </div>
            <Button radius="full" size="sm">
              Download
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
