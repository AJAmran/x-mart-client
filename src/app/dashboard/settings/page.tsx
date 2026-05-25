"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import { Divider } from "@nextui-org/divider";
import { toast } from "sonner";
import {
  Save,
  User,
  Store,
  Bell,
  Shield,
  Palette,
} from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    storeName: "X-Mart",
    storeEmail: "admin@xmart.com",
    storePhone: "+8801234567890",
    storeAddress: "Dhaka, Bangladesh",
    storeDescription: "Your trusted online marketplace",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    orderUpdates: true,
    lowStockAlerts: true,
    weeklyReport: false,
  });

  const handleProfileSave = () => {
    toast.success("Store settings saved successfully");
  };

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success("Notification preference updated");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-default-500">Manage your store and account preferences</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white"><Store className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold">Store Information</h3>
              <p className="text-sm text-default-500">Update your store details</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Store Name" value={profile.storeName} onChange={(e) => setProfile({ ...profile, storeName: e.target.value })} />
            <Input label="Store Email" type="email" value={profile.storeEmail} onChange={(e) => setProfile({ ...profile, storeEmail: e.target.value })} />
            <Input label="Phone Number" value={profile.storePhone} onChange={(e) => setProfile({ ...profile, storePhone: e.target.value })} />
            <Input label="Address" value={profile.storeAddress} onChange={(e) => setProfile({ ...profile, storeAddress: e.target.value })} />
          </div>
          <Textarea label="Description" value={profile.storeDescription} onChange={(e) => setProfile({ ...profile, storeDescription: e.target.value })} />
          <div className="flex justify-end pt-2">
            <Button color="primary" startContent={<Save className="w-4 h-4" />} onPress={handleProfileSave}>
              Save Changes
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg text-white"><Bell className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold">Notifications</h3>
              <p className="text-sm text-default-500">Configure email and alert preferences</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4 pt-6">
          {[
            { key: "emailAlerts", label: "Email Alerts", desc: "Receive email notifications for important updates" },
            { key: "orderUpdates", label: "Order Updates", desc: "Get notified when new orders are placed" },
            { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Alert when product stock goes below threshold" },
            { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly sales summary report" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-default-500">{item.desc}</p>
              </div>
              <Switch
                isSelected={notifications[item.key as keyof typeof notifications]}
                onValueChange={() => handleNotificationChange(item.key)}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white"><Shield className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold">Security</h3>
              <p className="text-sm text-default-500">Manage account security settings</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Current Password" type="password" placeholder="Enter current password" />
            <Input label="New Password" type="password" placeholder="Enter new password" />
          </div>
          <div className="flex justify-end pt-2">
            <Button color="primary" variant="flat" onPress={() => toast.success("Password changed successfully")}>
              Update Password
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
