import { type FormEvent, useState } from "react";

interface AuthCodeFormProps {
  email: string;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (code: string) => void;
}

const AuthCodeForm = ({
  email,
  isLoading,
  onBack,
  onSubmit,
}: AuthCodeFormProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(code);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-xs font-bold uppercase text-[#aab7cf]">
          Confirmation code
        </label>
        <input
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          placeholder="6-digit code"
          className="w-full border border-[#24344f] bg-[#070b14] px-4 py-4 text-[#f4ff2f] outline-none transition placeholder:text-[#62708f] focus:border-[#22f5ff]"
        />
        <p className="mt-3 text-sm text-[#aab7cf]">
          We sent a code to <span className="text-[#22f5ff]">{email}</span>.
        </p>
      </div>

      <button
        className="w-full bg-[#f4ff2f] px-5 py-4 font-black uppercase text-[#05070d] transition hover:bg-[#22f5ff] focus:outline-none focus:ring-2 focus:ring-[#22f5ff]/60 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
        disabled={isLoading || code.length !== 6}
        type="submit"
      >
        Confirm
      </button>

      <button
        className="w-full border border-transparent px-4 py-3 text-center text-sm font-bold uppercase text-[#aab7cf] transition hover:border-[#22f5ff]/45 hover:bg-[#22f5ff]/10 hover:text-[#22f5ff]"
        disabled={isLoading}
        onClick={onBack}
        type="button"
      >
        Use another email
      </button>
    </form>
  );
};

export default AuthCodeForm;
