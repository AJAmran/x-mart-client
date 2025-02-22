import AuthForm from "@/src/components/authFrom";


export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen my-10">
      <AuthForm type="login" />
    </div>
  );
}
