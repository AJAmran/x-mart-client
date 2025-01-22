import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string; 
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  className,
  placeholder = "Search products...",
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
    />
  );
};

export default SearchBar;
