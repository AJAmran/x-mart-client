import { Metadata } from "next";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";


export const metadata: Metadata = {
  title: "Profile Management",
  description: "Manage your account profile and security settings",
};

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <Card className="p-4">
        <CardBody className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          </div>

          <Divider />

          <div>
            <h2 className="text-xl font-semibold mb-4">Security</h2>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
