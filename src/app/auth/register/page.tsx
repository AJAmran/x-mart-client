"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Link from "next/link";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegistrationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Registration Data:", data);
    // Add your API call here
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Username
            </label>
            <div className="relative">
              <AiOutlineUser className="absolute left-3 top-3 text-mutedText" />
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                placeholder="Enter your username"
                className="w-full px-10 py-2 border rounded-lg outline-none focus:border-primary"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-3 text-mutedText" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter your email"
                className="w-full px-10 py-2 border rounded-lg outline-none focus:border-primary"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Password
            </label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 text-mutedText" />
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                placeholder="Enter your password"
                className="w-full px-10 py-2 border rounded-lg outline-none focus:border-primary"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 text-mutedText" />
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                placeholder="Confirm your password"
                className="w-full px-10 py-2 border rounded-lg outline-none focus:border-primary"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-mutedText mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
