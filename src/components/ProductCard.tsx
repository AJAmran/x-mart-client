import Image from "next/image";
import { Product } from "../types";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="font-semibold text-lg">{product.name}</h3>
      </CardHeader>
      <CardBody>
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-auto object-cover"
        />
        <p className="text-xl font-bold mt-2">${product.price}</p>
      </CardBody>
      <CardFooter>
        <Button color="primary">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};
