import { FC } from "react";
import {
  BoxIcon,
  ChartIcon,
  ClipboxIcon,
  FunnelIcon,
  ProfileIcon,
} from "../icons";
import { Link } from "@nextui-org/link";

const Sidebar: FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-extrabold text-primary mb-8">Dashboard</h2>
      <ul className="space-y-4">
        {/* User Management */}
        <li>
          <Link
            href="/dashboard/user-management"
            className="flex items-center space-x-3 hover:bg-primary hover:text-white p-3 rounded-md transition-all"
          >
            <ProfileIcon className="text-xl" />
            <span>User Management</span>
          </Link>
        </li>

        {/* Product Management */}
        <li>
          <Link
            href="/dashboard/product-management"
            className="flex items-center space-x-3 hover:bg-primary hover:text-white p-3 rounded-md transition-all"
          >
            <BoxIcon className="text-xl" />
            <span>Product Management</span>
          </Link>
        </li>

        {/* Order Management */}
        <li>
          <Link
            href="/dashboard/order-management"
            className="flex items-center space-x-3 hover:bg-primary hover:text-white p-3 rounded-md transition-all"
          >
            <ClipboxIcon className="text-xl" />
            <span>Order Management</span>
          </Link>
        </li>

        {/* Sales & Analytics */}
        <li>
          <Link
            href="/dashboard/sales-analytics"
            className="flex items-center space-x-3 hover:bg-primary hover:text-white p-3 rounded-md transition-all"
          >
            <ChartIcon className="text-xl" />
            <span>Sales & Analytics</span>
          </Link>
        </li>

        {/* Inventory Management */}
        <li>
          <Link
            href="/dashboard/inventory-management"
            className="flex items-center space-x-3 hover:bg-primary hover:text-white p-3 rounded-md transition-all"
          >
            <FunnelIcon className="text-xl" />
            <span>Inventory Management</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
