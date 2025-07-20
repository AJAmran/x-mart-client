// src/components/outlets/SearchAndFilter.tsx
'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export function SearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="bg-white rounded-full shadow-lg p-1 flex items-center max-w-2xl mx-auto">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by location, city, or outlet name"
          className="block w-full pl-12 pr-4 py-3 border-none rounded-l-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="relative">
        <select
          className="appearance-none bg-transparent border-none pr-8 pl-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-r-full"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All Outlets</option>
          <option value="nearby">Near Me</option>
          <option value="24h">24 Hour</option>
          <option value="premium">Premium</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <button
        type="button"
        className="ml-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </div>
  );
}