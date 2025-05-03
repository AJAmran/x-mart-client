"use client";

import { useCallback, useState, useEffect } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Eye,
  EyeOff,
  Apple,
  Lock,
  Shield,
  Smartphone,
  User,
  Mail,
  Check,
  X,
} from "lucide-react";

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

const validationIcons = {
  valid: <Check className="w-4 h-4 text-success" />,
  invalid: <X className="w-4 h-4 text-danger" />,
  default: <div className="w-4 h-4 rounded-full bg-default-300" />,
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const isRegister = type === "register";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const { setIsLoading } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData | LoginFormData>({
    resolver: zodResolver(
      isRegister ? registerValidationSchema : loginValidationSchema
    ),
    mode: "onChange",
  });

  const formData = watch();

  const { mutateAsync: registerMutation } = useUserRegistration();
  const { mutateAsync: loginMutation } = useUserLogin(() => {
    setIsLoading(true);
  });

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/apple`;
  };

  const onSubmit: SubmitHandler<RegisterFormData | LoginFormData> = useCallback(
    async (data) => {
      try {
        setError(null);

        if (isRegister) {
          const response = await registerMutation(data as RegisterFormData);
          if (response.success) {
            router.push("/auth/login");
          }
        } else {
          const response = await loginMutation(data as LoginFormData);
          if (response.success) {
            const redirectUrl = searchParams.get("redirect");
            router.push(redirectUrl || "/");
          }
        }
      } catch (error: any) {
        setError(error.message);
      }
    },
    [isRegister, registerMutation, loginMutation, router, searchParams]
  );

  const getPasswordStrength = (password: string = "") => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData?.password);

  const getValidationStatus = (field: string) => {
    if (!formData || !(field in formData)) return "default";
    return errors[field as keyof typeof formData] ? "invalid" : "valid";
  };

  const FieldInstructions = () => {
    if (!activeField) return null;

    const instructions = {
      name: {
        title: "Name Requirements",
        icon: <User className="w-5 h-5 text-primary" />,
        rules: [
          {
            text: "Required field",
            valid: isRegister && !!(formData as RegisterFormData)?.name,
          },
        ],
      },
      email: {
        title: "Email Requirements",
        icon: <Mail className="w-5 h-5 text-primary" />,
        rules: [
          {
            text: "Valid email format",
            valid: !errors.email && !!formData?.email,
          },
        ],
      },
      mobileNumber: {
        title: "Mobile Number Requirements",
        icon: <Smartphone className="w-5 h-5 text-primary" />,
        rules: [
          {
            text: "10-15 digits only",
            valid:
              isRegister &&
              !(errors as FieldErrors<RegisterFormData>).mobileNumber &&
              !!(formData as RegisterFormData)?.mobileNumber,
          },
        ],
      },
      password: {
        title: "Password Strength",
        icon: <Lock className="w-5 h-5 text-primary" />,
        rules: [
          {
            text: "At least 8 characters",
            valid: (formData?.password?.length || 0) >= 8,
          },
          {
            text: "Contains uppercase letter",
            valid: /[A-Z]/.test(formData?.password || ""),
          },
          {
            text: "Contains number",
            valid: /[0-9]/.test(formData?.password || ""),
          },
          {
            text: "Contains special character",
            valid: /[^A-Za-z0-9]/.test(formData?.password || ""),
          },
        ],
      },
      profilePhoto: {
        title: "Profile Photo Requirements",
        icon: <User className="w-5 h-5 text-primary" />,
        rules: [
          {
            text: "Valid URL format",
            valid:
              isRegister &&
              !(errors as FieldErrors<RegisterFormData>).profilePhoto &&
              !!(formData as RegisterFormData)?.profilePhoto,
          },
        ],
      },
    };

    const currentInstructions =
      instructions[activeField as keyof typeof instructions];
    if (!currentInstructions) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-content1 p-4 rounded-lg border border-default-200 shadow-sm mt-2"
      >
        <div className="flex items-center gap-2 mb-3">
          {currentInstructions.icon}
          <h4 className="font-medium">{currentInstructions.title}</h4>
        </div>
        <ul className="space-y-2">
          {currentInstructions.rules.map((rule, index) => (
            <li key={index} className="flex items-center gap-2">
              {rule.valid ? validationIcons.valid : validationIcons.invalid}
              <span
                className={rule.valid ? "text-default-600" : "text-default-400"}
              >
                {rule.text}
              </span>
            </li>
          ))}
        </ul>
        {activeField === "password" && (
          <div className="mt-3">
            <div className="flex gap-1 h-1.5 mb-2">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`flex-1 rounded-full ${
                    passwordStrength >= level
                      ? level > 2
                        ? "bg-success"
                        : level > 1
                          ? "bg-warning"
                          : "bg-danger"
                      : "bg-default-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-default-500">
              {passwordStrength === 0
                ? "Very weak"
                : passwordStrength === 1
                  ? "Weak"
                  : passwordStrength === 2
                    ? "Moderate"
                    : passwordStrength === 3
                      ? "Strong"
                      : "Very strong"}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto p-4">
      {/* Left Column - Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block"
      >
        <div className="bg-gradient-to-br from-content1 to-default-50 p-8 rounded-xl border border-default-200 shadow-sm h-full">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {isRegister ? "Join Our Platform" : "Welcome Back"}
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-100/50 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Enterprise-grade Security
                </h3>
                <p className="text-sm text-default-600 mt-1">
                  Your data is protected with bank-level encryption and security
                  protocols.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-success-100/50 p-2 rounded-lg">
                <Lock className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Privacy First Approach
                </h3>
                <p className="text-sm text-default-600 mt-1">
                  We never sell your data and adhere to strict privacy policies.
                </p>
              </div>
            </div>

            <div className="bg-content1 p-4 rounded-lg border border-default-200">
              <h3 className="font-medium text-foreground mb-2">Quick Tips:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-default-600">
                <li>Use a password manager for strong, unique passwords</li>
                <li>Enable two-factor authentication for added security</li>
                <li>Keep your contact information up to date</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-default-200 shadow-sm">
          <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
            <h1 className="text-2xl font-bold text-foreground">
              {isRegister ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-sm text-default-500 mt-1">
              {isRegister
                ? "Start your journey with us today"
                : "Access your personalized dashboard"}
            </p>
          </CardHeader>

          <CardBody className="px-6 py-4">
            {error && (
              <div className="bg-danger-50 text-danger-600 p-3 rounded-md text-sm mb-4 flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isRegister && (
                <div>
                  <Input
                    {...register("name")}
                    label="Full Name"
                    placeholder="John Doe"
                    variant="bordered"
                    radius="sm"
                    startContent={<User className="w-5 h-5 text-default-400" />}
                    isInvalid={!!(errors as FieldErrors<RegisterFormData>).name}
                    errorMessage={
                      (errors as FieldErrors<RegisterFormData>).name?.message
                    }
                    onFocus={() => setActiveField("name")}
                    onBlur={() => setActiveField(null)}
                  />
                </div>
              )}

              <div>
                <Input
                  {...register("email")}
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  variant="bordered"
                  radius="sm"
                  startContent={<Mail className="w-5 h-5 text-default-400" />}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                />
              </div>

              {isRegister && (
                <div>
                  <Input
                    {...register("mobileNumber")}
                    label="Mobile Number"
                    type="tel"
                    placeholder="1234567890"
                    variant="bordered"
                    radius="sm"
                    startContent={
                      <Smartphone className="w-5 h-5 text-default-400" />
                    }
                    isInvalid={
                      !!(errors as FieldErrors<RegisterFormData>).mobileNumber
                    }
                    errorMessage={
                      (errors as FieldErrors<RegisterFormData>).mobileNumber
                        ?.message
                    }
                    onFocus={() => setActiveField("mobileNumber")}
                    onBlur={() => setActiveField(null)}
                  />
                </div>
              )}

              <div>
                <Input
                  {...register("password")}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  variant="bordered"
                  radius="sm"
                  startContent={<Lock className="w-5 h-5 text-default-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-default-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-default-400" />
                      )}
                    </button>
                  }
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField(null)}
                />
              </div>

              {isRegister && (
                <div>
                  <Input
                    {...register("profilePhoto")}
                    label="Profile Photo URL (Optional)"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    variant="bordered"
                    radius="sm"
                    startContent={<User className="w-5 h-5 text-default-400" />}
                    isInvalid={
                      !!(errors as FieldErrors<RegisterFormData>).profilePhoto
                    }
                    errorMessage={
                      (errors as FieldErrors<RegisterFormData>).profilePhoto
                        ?.message
                    }
                    onFocus={() => setActiveField("profilePhoto")}
                    onBlur={() => setActiveField(null)}
                  />
                </div>
              )}

              <AnimatePresence>
                {activeField && <FieldInstructions />}
              </AnimatePresence>

              <Button
                type="submit"
                color="primary"
                radius="sm"
                className="w-full py-6 font-medium"
                isLoading={isSubmitting}
                isDisabled={!isValid && isSubmitting}
              >
                {isRegister ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <Divider className="my-6" />

            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                variant="bordered"
                radius="sm"
                className="w-full"
                startContent={
                  <div className="bg-white rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                }
              >
                Continue with Google
              </Button>
              <Button
                onClick={handleAppleLogin}
                variant="bordered"
                radius="sm"
                className="w-full"
                startContent={<Apple className="w-5 h-5" />}
              >
                Continue with Apple
              </Button>
            </div>
          </CardBody>

          <CardFooter className="px-6 pb-6 pt-2 justify-center">
            <p className="text-sm text-default-600">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                href={isRegister ? "/auth/login" : "/auth/register"}
                className="text-primary hover:underline font-medium"
              >
                {isRegister ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthForm;
