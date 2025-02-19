"use client";

import { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "@/src/validations/validationSchema";
import { z } from "zod";

// Types for form data
type FormData = {
  name?: string;
  email: string;
  password: string;
  mobileNumber: string;
  profilePhoto?: string;
};

type AuthFormProps = {
  type: "login" | "register";
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  // Use Form with TypeScript for validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(
      type === "register" ? registerValidationSchema : loginValidationSchema
    ),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = useCallback(async (data) => {
    console.log("Form Submitted", data);
    // Here you'd make your API call or process the data
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center min-h-screen"
    >
      <Card className="w-full max-w-md p-8 shadow-xl rounded-lg bg-white">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {type === "login" ? "Login to Your Account" : "Create a New Account"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-5">
          {type === "register" && (
            <div>
              <Input {...register("name")} placeholder="Full Name" />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {type === "register" && (
            <div>
              <Input
                {...register("mobileNumber")}
                type="text"
                placeholder="Mobile Number"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>
          )}
          <div>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {type === "register" && (
            <div>
              <Input
                {...register("profilePhoto")}
                type="text"
                placeholder="Profile Photo URL"
              />
              {errors.profilePhoto && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profilePhoto.message}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            className="w-full py-3 text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : type === "login"
                ? "Login"
                : "Register"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <Link
            href={type === "login" ? "/auth/register" : "/auth/login"}
            className="text-blue-500 hover:underline"
          >
            {type === "login" ? "Register" : "Login"}
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
