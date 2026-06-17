import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthPageLayout from "../components/AuthPageLayout";
import { useAuth } from "@/providers/auth/useAuth.hook";
import Loader from "../../../shared/ui/Loader";

const getCallbackParams = () => {
  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, ""),
  );
  const searchParams = new URLSearchParams(window.location.search);

  return {
    accessToken:
      hashParams.get("accessToken") ?? searchParams.get("accessToken"),
    refreshToken:
      hashParams.get("refreshToken") ?? searchParams.get("refreshToken"),
    error: hashParams.get("error") ?? searchParams.get("error"),
  };
};

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [error, setError] = useState("");
  const params = useMemo(getCallbackParams, []);

  useEffect(() => {
    if (params.error) {
      setError(params.error);
      return;
    }

    if (!params.accessToken || !params.refreshToken) {
      setError("OAuth provider did not return valid session tokens.");
      return;
    }

    setToken(params.accessToken, params.refreshToken);
    window.history.replaceState(null, "", "/auth/oauth/callback");
    navigate("/app", { replace: true });
  }, [navigate, params, setToken]);

  return (
    <AuthPageLayout>
      <h1 className="text-3xl font-black uppercase tracking-normal">
        Finishing sign in
      </h1>
      <p className="mt-3 mb-6 text-sm leading-6 text-[#aab7cf]">
        Your provider account was verified. The app is creating your session.
      </p>

      {error ? (
        <div className="space-y-5">
          <p className="border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
          <Link
            className="block w-full bg-[#f4ff2f] px-5 py-4 text-center font-black uppercase text-[#05070d] no-underline transition hover:bg-[#22f5ff] focus:outline-none focus:ring-2 focus:ring-[#22f5ff]/60 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
            to="/login"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <div className="flex min-h-56 items-center justify-center">
          <Loader />
        </div>
      )}
    </AuthPageLayout>
  );
};

export default OAuthCallbackPage;
