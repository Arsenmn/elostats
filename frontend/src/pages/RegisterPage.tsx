import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import type { AuthFormData } from "../types/auth.interface";
import Loader from "../shared/ui/Loader";
import AuthFields from "../components/auth/AuthFields";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import { useAuth } from "../hooks/useAuth.hook";
import { authApi } from "../api/auth.api";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { accessToken, setToken } = useAuth();
  const navigate = useNavigate();

  const { handleSubmit, control, reset } = useForm<AuthFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.register(data);

      setToken(response.accessToken, response.refreshToken);
      reset();
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (accessToken) return <Navigate to="/app" replace />;

  return (
    <AuthPageLayout>
      <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
      <p className="mt-3 mb-6 text-sm leading-6 text-[#c9d5b9]">
        Register with your email and password.
      </p>

      {isLoading ? (
        <div className="flex min-h-56 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <AuthFields control={control} autoCompletePassword="new-password" />

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-xl bg-[#ffe8a0] px-5 py-4 font-semibold text-[#102518] transition hover:bg-[#fff1bd]"
            type="submit"
          >
            Sign up
          </button>

          <Link
            className="block w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-[#c9d5b9] no-underline transition hover:bg-[#ffe8a0]/10 hover:text-[#ffe8a0]"
            to="/login"
          >
            Already have an account?
            <span className="font-semibold text-[#ffe8a0]"> Login</span>
          </Link>
        </form>
      )}
    </AuthPageLayout>
  );
};

export default RegisterPage;
