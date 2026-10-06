"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Save,
  Shield,
  Store,
} from "lucide-react";

import { PageHeader } from "@/src/components/UI/Section";
import { Container } from "@/src/components/UI/Container";
import { Panel } from "@/src/components/dashboard/Panel";
import { ThemeSwitch } from "@/src/components/theme-switch";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";

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
    <>
      <PageHeader
        description="Manage your store details, notifications, and security."
        eyebrow="Workspace"
        title="Settings"
      />

      <Container className="py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            {/* Store information */}
            <Panel
              action={
                <span className="grid size-9 place-items-center rounded-md bg-brand-subtle text-brand">
                  <Store aria-hidden size={17} />
                </span>
              }
              description="Public details shown across the storefront."
              title="Store information"
            >
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                <Input
                  label="Store name"
                  value={profile.storeName}
                  onChange={(e) =>
                    setProfile({ ...profile, storeName: e.target.value })
                  }
                />
                <Input
                  label="Store email"
                  type="email"
                  value={profile.storeEmail}
                  onChange={(e) =>
                    setProfile({ ...profile, storeEmail: e.target.value })
                  }
                />
                <Input
                  label="Phone number"
                  value={profile.storePhone}
                  onChange={(e) =>
                    setProfile({ ...profile, storePhone: e.target.value })
                  }
                />
                <Input
                  label="Address"
                  value={profile.storeAddress}
                  onChange={(e) =>
                    setProfile({ ...profile, storeAddress: e.target.value })
                  }
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="Description"
                    value={profile.storeDescription}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        storeDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end border-t border-line-hairline pt-5">
                <Button
                  color="primary"
                  startContent={<Save aria-hidden className="size-4" />}
                  onPress={handleProfileSave}
                >
                  Save changes
                </Button>
              </div>
            </Panel>

            {/* Notifications */}
            <Panel
              action={
                <span className="grid size-9 place-items-center rounded-md bg-success/15 text-success">
                  <Bell aria-hidden size={17} />
                </span>
              }
              description="Choose what we ping you about."
              title="Notifications"
            >
              <div>
                {[
                  {
                    key: "emailAlerts",
                    label: "Email alerts",
                    desc: "Receive email notifications for important updates",
                  },
                  {
                    key: "orderUpdates",
                    label: "Order updates",
                    desc: "Get notified when new orders are placed",
                  },
                  {
                    key: "lowStockAlerts",
                    label: "Low stock alerts",
                    desc: "Alert when product stock goes below threshold",
                  },
                  {
                    key: "weeklyReport",
                    label: "Weekly report",
                    desc: "Receive a weekly sales summary report",
                  },
                ].map((item, i, arr) => (
                  <div
                    key={item.key}
                    className={
                      "flex items-center justify-between gap-4 py-4" +
                      (i < arr.length - 1 ? " border-b border-line-hairline" : "")
                    }
                  >
                    <div className="min-w-0">
                      <p className="text-body-sm font-semibold text-content">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-label-sm text-content-subtle">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      isSelected={
                        notifications[
                          item.key as keyof typeof notifications
                        ]
                      }
                      onValueChange={() => handleNotificationChange(item.key)}
                    />
                  </div>
                ))}
              </div>
            </Panel>

            {/* Security */}
            <Panel
              action={
                <span className="grid size-9 place-items-center rounded-md bg-warning/15 text-warning">
                  <Shield aria-hidden size={17} />
                </span>
              }
              description="Update the password for this account."
              title="Security"
            >
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                <Input
                  label="Current password"
                  placeholder="Enter current password"
                  type="password"
                />
                <Input
                  label="New password"
                  placeholder="Enter new password"
                  type="password"
                />
              </div>
              <div className="mt-6 flex justify-end border-t border-line-hairline pt-5">
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() =>
                    toast.success("Password changed successfully")
                  }
                >
                  Update password
                </Button>
              </div>
            </Panel>
          </div>

          {/* Workspace sidebar */}
          <div className="space-y-5">
            <Panel
              description="Pick the look for this console."
              title="Appearance"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-semibold text-content">
                    Colour theme
                  </p>
                  <p className="mt-0.5 text-label-sm text-content-subtle">
                    Applies to the whole console.
                  </p>
                </div>
                <ThemeSwitch showLabel />
              </div>
            </Panel>

            <Panel
              description="Environment details for support requests."
              title="Workspace"
            >
              <dl className="space-y-3">
                {[
                  { label: "Store", value: profile.storeName },
                  { label: "Region", value: "Bangladesh (en-BD)" },
                  { label: "Currency", value: "Taka (৳)" },
                  { label: "Console", value: "X-Mart Admin" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-label-sm text-content-subtle">
                      {row.label}
                    </dt>
                    <dd className="text-body-sm font-medium text-content">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        </div>
      </Container>
    </>
  );
}
