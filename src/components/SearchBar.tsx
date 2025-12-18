"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { SearchIcon } from "./icons";
import { X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void; // Add onSearch prop
  className?: string;
  placeholder?: string;
  debounceDelay?: number; // Delay in milliseconds for debouncing
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  className,
  placeholder = "Search products...",
  debounceDelay = 300, // Default debounce delay
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Debounce the onChange function
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onChange(inputValue);
    }, debounceDelay);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, debounceDelay, onChange]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Clear the search input
  const handleClear = () => {
    setInputValue("");
    onChange("");
    onSearch(""); // Clear search results
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue); // Trigger search
  };

  return (
    <form onSubmit={handleSearchSubmit} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        startContent={<SearchIcon size={20} className="text-gray-400" />}
        endContent={
          inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )
        }
        classNames={{
          base: "w-full",
          input: "text-base",
          inputWrapper:
            "h-12 border-2 border-transparent bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 shadow-sm",
        }}
      />
    </form>
  );
};

export default SearchBar;
