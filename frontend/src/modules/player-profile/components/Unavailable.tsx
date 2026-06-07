interface UnavailableProps {
  message?: string;
}

const Unavailable = ({ message }: UnavailableProps) => {
  return (
    <p className="border border-dashed border-[#33405f] bg-black/20 p-4 text-sm text-[#aab7cf]">
      {message ?? "This FACEIT section is unavailable."}
    </p>
  );
};

export default Unavailable;
