"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";

import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";

const ProfilePage = () => {
  const { user, isLoading, setIsLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
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
          </CardBody>
          <Divider className="my-4" />
          <div className="flex flex-col gap-4 px-4 pb-4">
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
