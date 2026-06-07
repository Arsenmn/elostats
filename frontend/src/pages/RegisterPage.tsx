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
      <h1 className="text-3xl font-black uppercase tracking-normal">Create account</h1>
      <p className="mt-3 mb-6 text-sm leading-6 text-[#aab7cf]">
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
                <p className="border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            className="w-full bg-[#f4ff2f] px-5 py-4 font-black uppercase text-[#05070d] transition hover:bg-[#22f5ff] focus:outline-none focus:ring-2 focus:ring-[#22f5ff]/60 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
            type="submit"
          >
            Sign up
          </button>

          <Link
            className="block w-full border border-transparent px-4 py-3 text-center text-sm font-bold uppercase text-[#aab7cf] no-underline transition hover:border-[#22f5ff]/45 hover:bg-[#22f5ff]/10 hover:text-[#22f5ff]"
            to="/login"
          >
            Already have an account?
            <span className="font-semibold text-[#22f5ff]"> Login</span>
          </Link>
        </form>
      )}
    </AuthPageLayout>
  );
};

export default RegisterPage;
