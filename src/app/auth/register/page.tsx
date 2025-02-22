import AuthForm from "@/src/components/authFrom";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen my-10">
      <AuthForm type="register" />
    </div>
  );
}
