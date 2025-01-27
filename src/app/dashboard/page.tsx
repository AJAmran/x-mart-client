import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { FC } from "react";

const DashboardPage: FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">
        Welcome to the Admin Dashboard
      </h2>

      {/* Dashboard Layout using Tailwind CSS Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* User Management Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-sm">
            <CardBody>
              <h4>User Management</h4>
              <p>Manage users, permissions, and roles.</p>
            </CardBody>
            <CardFooter>
              <Button>Manage</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Product Management Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-sm">
            <CardBody>
              <h4>Product Management</h4>
              <p>Manage your products and categories.</p>
            </CardBody>
            <CardFooter>
              <Button>Manage</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Order Management Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-sm">
            <CardBody>
              <h4>Order Management</h4>
              <h4>Track and manage customer orders.</h4>
            </CardBody>
            <CardFooter>
              <Button>Manage</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sales & Analytics Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-sm">
            <CardBody>
              <h4>Sales & Analytics</h4>
              <p>Monitor your sales performance and analytics.</p>
            </CardBody>
            <CardFooter>
              <Button>View</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Inventory Management Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-sm">
            <CardBody>
              <h4>Inventory Management</h4>
              <p>Manage stock levels and inventory flow.</p>
            </CardBody>
            <CardFooter>
              <Button>Manage</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
