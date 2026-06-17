import { Link } from "react-router";

interface ProfileEmptyStateProps {
  message: string;
}

export function ProfileEmptyState({ message }: ProfileEmptyStateProps) {
  return (
    <div className="border border-[#29324a] bg-[#0c101a] p-8">
      <h1 className="text-3xl font-bold">Profile unavailable</h1>
      <p className="mt-3 text-[#aab7cf]">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-flex bg-[#22f5ff] px-5 py-3 font-black uppercase text-[#05070d] no-underline"
      >
        Back to search
      </Link>
    </div>
  );
}
