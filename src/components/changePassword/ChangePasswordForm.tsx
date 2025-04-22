"use client";

import { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { z } from "zod";
import { useChangePassword } from "@/src/hooks/auth.hook";

// Validation schema for change password
const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const { mutateAsync: changePasswordMutation } = useChangePassword();

  const onSubmit: SubmitHandler<ChangePasswordFormData> = useCallback(
    async (data) => {
      try {
        await changePasswordMutation(data);
      } catch (error: any) {}
    },
    [changePasswordMutation]
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
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register("oldPassword")}
            label="Old Password"
            type="password"
            placeholder="Enter your old password"
            variant="bordered"
            isInvalid={!!errors.oldPassword}
            errorMessage={errors.oldPassword?.message}
          />

          <Input
            {...register("newPassword")}
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            variant="bordered"
            isInvalid={!!errors.newPassword}
            errorMessage={errors.newPassword?.message}
          />

          <Button
            type="submit"
            color="primary"
            className="w-full py-3 text-lg font-semibold mt-4 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Change Password"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default ChangePasswordForm;
