import ChangePasswordForm from "@/src/components/changePassword/ChangePasswordForm";
import { Suspense } from "react";

export default function ChangePasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen my-10">
      <Suspense fallback={<div>Loading...</div>}>
        <ChangePasswordForm />
      </Suspense>
    </div>
  );
}
