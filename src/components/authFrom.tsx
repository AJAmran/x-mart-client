"use client";

import { useCallback } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams

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

/**
 * Only ever redirect to a path inside this app.
 *
 * `?redirect=` is attacker-controllable, so `//evil.com` and
 * `https://evil.com` would otherwise turn a successful login into an open
 * redirect that leaks the referrer and phishs the freshly authenticated user.
 */
const safeRedirect = (target: string | null): string => {
  if (!target) return "/";

  // Must be a single leading slash: rejects `//host`, `/\host` and absolute URLs.
  if (!target.startsWith("/") || target.startsWith("//")) return "/";

  return target;
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const isRegister = type === "register";
  const router = useRouter();
  const searchParams = useSearchParams();

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
        if (isRegister) {
          const response = await registerMutation(data as RegisterFormData);

          if (response.success) {
            router.push("/auth/login");
          }
        } else {
          const response = await loginMutation(data as LoginFormData);

          if (response.success) {
            router.push(safeRedirect(searchParams.get("redirect")));
          }
        }
      } catch {
        // Toast error is handled by React Query onError
      }
    },
    [isRegister, registerMutation, loginMutation, router, searchParams]
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-screen"
      initial={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl border">
        <h2 className="text-3xl font-bold text-center drop-shadow-lg mb-6">
          {isRegister ? "Create a New Account" : "Login to Your Account"}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {isRegister && (
            <Input
              {...register("name")}
              errorMessage={
                (errors as FieldErrors<RegisterFormData>).name?.message
              }
              isInvalid={!!(errors as FieldErrors<RegisterFormData>).name}
              label="Full Name"
              placeholder="Enter your full name"
              variant="bordered"
            />
          )}

          <Input
            {...register("email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            label="Email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />

          {isRegister && (
            <Input
              {...register("mobileNumber")}
              errorMessage={
                (errors as FieldErrors<RegisterFormData>).mobileNumber?.message
              }
              isInvalid={
                !!(errors as FieldErrors<RegisterFormData>).mobileNumber
              }
              label="Mobile Number"
              placeholder="Enter your mobile number"
              type="text"
              variant="bordered"
            />
          )}

          <Input
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            label="Password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
          />

          {isRegister && (
            <Input
              {...register("profilePhoto")}
              errorMessage={
                (errors as FieldErrors<RegisterFormData>).profilePhoto?.message
              }
              isInvalid={
                !!(errors as FieldErrors<RegisterFormData>).profilePhoto
              }
              label="Profile Photo URL"
              placeholder="Enter profile photo URL"
              type="text"
              variant="bordered"
            />
          )}

          <Button
            className="w-full py-3 text-lg font-semibold mt-4 transition-all"
            color="primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Processing..." : isRegister ? "Register" : "Login"}
          </Button>
        </form>

        <p className={`text-sm text-center mt-6`}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            className="text-blue-400 hover:underline"
            href={isRegister ? "/auth/login" : "/auth/register"}
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
