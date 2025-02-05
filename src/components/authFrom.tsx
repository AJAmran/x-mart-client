"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { authSchema, FormData } from "@/src/validations/validationSchema";
import { useImageUpload } from "@/src/hooks/useImageUpload";

type AuthFormProps = {
  type: "login" | "register";
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { preview, fileError, handleImageChange } = useImageUpload();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = useCallback(async (data: FormData) => {
    console.log("Form Submitted", data);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-lg bg-white">
        <h2 className="text-2xl font-semibold text-center text-gray-800">{type === "login" ? "Login to Your Account" : "Create a New Account"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-5">
          {type === "register" && (
            <div>
              <Input {...register("name")} placeholder="Full Name" />
              {errors.name?.message && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <Input {...register("email")} type="email" placeholder="Email Address" />
            {errors.email?.message && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Input {...register("password")} type="password" placeholder="Password" />
            {errors.password?.message && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          {type === "register" && (
            <div>
              <Input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
              {errors.confirmPassword?.message && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
          )}
          {type === "register" && (
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white p-2" />
              {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
              {preview && <div className="mt-3"><Image src={preview} alt="Preview" width={100} height={100} className="rounded-md shadow-md" /></div>}
            </div>
          )}
          <Button type="submit" color="primary" className="w-full py-3 text-lg font-semibold" disabled={isSubmitting}>{isSubmitting ? "Processing..." : type === "login" ? "Login" : "Register"}</Button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">{type === "login" ? "Don't have an account?" : "Already have an account?"} <Link href={type === "login" ? "/auth/register" : "/auth/login"} className="text-blue-500 hover:underline">{type === "login" ? "Register" : "Login"}</Link></p>
      </Card>
    </motion.div>
  );
};

export default AuthForm;