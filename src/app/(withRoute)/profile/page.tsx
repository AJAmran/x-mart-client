"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { Input } from "@nextui-org/input";

import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";
import { useUpdateUser } from "@/src/hooks/useUser";

const ProfilePage = () => {
  const { user, isLoading, setIsLoading, setUser } = useUser();
  const router = useRouter();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      router.push("/auth/login");
    } catch (error: any) {
      throw error(error.message || "Failed to log out.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      mobileNumber: user?.mobileNumber || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user?._id) return;
    updateUser(
      { id: user._id, userData: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setUser({ ...user, ...formData });
        },
      }
    );
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading profile..." size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner label="Loading profile..." size="lg" />}>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg p-6 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-col items-center">
            <Image
              alt={user.name}
              className="rounded-full border-2 border-primary mb-4"
              height={120}
              src={user.profilePhoto || "/default-avatar.png"}
              width={120}
            />
            <h2 className="text-2xl font-bold text-center">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.role}</p>
          </CardHeader>
          <Divider className="my-4" />
          <CardBody className="space-y-4">
            {isEditing ? (
              <>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Name
                  </span>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Mobile Number
                  </span>
                  <Input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Email
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Mobile Number
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {user.mobileNumber || "Not provided"}
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {user.status || "Active"}
                  </p>
                </div>
              </>
            )}
          </CardBody>
          <Divider className="my-4" />
          <div className="flex flex-col gap-4 px-4 pb-4">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  color="default"
                  variant="flat"
                  onPress={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  color="primary"
                  isLoading={isUpdating}
                  onPress={handleSave}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                color="primary"
                variant="flat"
                onPress={handleEdit}
              >
                Edit Profile
              </Button>
            )}
            <Link href="/auth/change-password">
              <Button className="w-full" color="primary" variant="flat">
                Change Password
              </Button>
            </Link>
            <Button
              className="w-full"
              color="danger"
              isLoading={isLoading}
              variant="flat"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </Suspense>
  );
};

export default ProfilePage;
