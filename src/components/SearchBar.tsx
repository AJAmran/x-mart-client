"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Search as SearchIcon, X } from "lucide-react";

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
          base: "w-full max-w-md",
          input: "text-sm",
          inputWrapper:
            "border border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500",
        }}
      />
    </form>
  );
};

export default SearchBar;
