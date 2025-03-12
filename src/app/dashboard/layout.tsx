import Sidebar from "@/src/components/UI/Sidebar";
import React from "react";
import { Toaster } from "sonner";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
