import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu } from "@nextui-org/dropdown";
import { useState } from "react";

export const SortingMenu = () => {
  const [selectedSort, setSelectedSort] = useState("popularity");

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    console.log("Selected sort:", value); // You can replace this with a function to sort data.
  };

  return (
    <Dropdown>
      <Button>
        Sort: {selectedSort === "popularity" ? "Popularity" : "Price"}
      </Button>
      <DropdownMenu
        aria-label="Sorting options"
        onAction={(key) => handleSortChange(key as string)}
      >
        <DropdownItem key="popularity">Popularity</DropdownItem>
        <DropdownItem key="price-asc">Price: Low to High</DropdownItem>
        <DropdownItem key="price-desc">Price: High to Low</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
