import AuthForm from "@/src/components/authFrom";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen my-10">
     <Suspense fallback={<div>Loading...</div>}>
        <AuthForm type="register" />
      </Suspense>
    </div>
  );
}
