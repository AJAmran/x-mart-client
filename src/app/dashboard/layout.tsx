import Sidebar from "@/src/components/UI/Sidebar";
import { SearchIcon } from "@/src/components/icons";
import React from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 truncate">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative group hidden sm:block">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                aria-label="Search"
                className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                placeholder="Search..."
                type="search"
              />
            </div>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto pb-16 lg:pb-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
