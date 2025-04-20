"use client";

import { useCallback, useState } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams
import { toast } from "sonner";

import {
  registerValidationSchema,
  loginValidationSchema,
  type RegisterFormData,
  type LoginFormData,
} from "@/src/validations/validationSchema";
import { useUserRegistration, useUserLogin } from "@/src/hooks/auth.hook";
import { useUser } from "../context/user.provider";


type AuthFormProps = {
  type: "login" | "register";
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const isRegister = type === "register";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData | LoginFormData>({
    resolver: zodResolver(
      isRegister ? registerValidationSchema : loginValidationSchema
    ),
    mode: "onBlur",
  });

  const { mutateAsync: registerMutation } = useUserRegistration();
  const { mutateAsync: loginMutation } = useUserLogin(() => {
    setIsLoading(true);
  });

  const onSubmit: SubmitHandler<RegisterFormData | LoginFormData> = useCallback(
    async (data) => {
      try {
        setError(null);

        if (isRegister) {
          const response = await registerMutation(data as RegisterFormData);

          if (response.success) {
            toast.success("Registration successful! Please log in.");

            router.push("/auth/login");
          }
        } else {
          const response = await loginMutation(data as LoginFormData);

          if (response.success) {
            toast.success("Login successful!");

            // Get the redirect URL from query parameters
            const redirectUrl = searchParams.get("redirect");

            // Redirect to the original protected route or home page
            router.push(redirectUrl || "/");
          }
        }
      } catch (error: any) {
        setError(error.message || "An error occurred. Please try again.");
        toast.error(error.message || "An error occurred. Please try again.");
      }
    },
    [isRegister, registerMutation, loginMutation, router, searchParams] 
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center min-h-screen"
    >
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl border">
        <h2 className="text-3xl font-bold text-center drop-shadow-lg mb-6">
          {isRegister ? "Create a New Account" : "Login to Your Account"}
        </h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isRegister && (
            <Input
              {...register("name")}
              label="Full Name"
              placeholder="Enter your full name"
              variant="bordered"
              isInvalid={!!(errors as FieldErrors<RegisterFormData>).name}
              errorMessage={
                (errors as FieldErrors<RegisterFormData>).name?.message
              }
            />
          )}

          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="Enter your email"
            variant="bordered"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          {isRegister && (
            <Input
              {...register("mobileNumber")}
              label="Mobile Number"
              type="text"
              placeholder="Enter your mobile number"
              variant="bordered"
              isInvalid={
                !!(errors as FieldErrors<RegisterFormData>).mobileNumber
              }
              errorMessage={
                (errors as FieldErrors<RegisterFormData>).mobileNumber?.message
              }
            />
          )}

          <Input
            {...register("password")}
            label="Password"
            type="password"
            placeholder="Enter your password"
            variant="bordered"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          {isRegister && (
            <Input
              {...register("profilePhoto")}
              label="Profile Photo URL"
              type="text"
              placeholder="Enter profile photo URL"
              variant="bordered"
              isInvalid={
                !!(errors as FieldErrors<RegisterFormData>).profilePhoto
              }
              errorMessage={
                (errors as FieldErrors<RegisterFormData>).profilePhoto?.message
              }
            />
          )}

          <Button
            type="submit"
            color="primary"
            className="w-full py-3 text-lg font-semibold mt-4 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : isRegister ? "Register" : "Login"}
          </Button>
        </form>

        <p className={`text-sm text-center mt-6`}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isRegister ? "/auth/login" : "/auth/register"}
            className="text-blue-400 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
