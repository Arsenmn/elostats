interface UnavailableProps {
  message?: string;
}

const Unavailable = ({ message }: UnavailableProps) => {
  return (
    <p className="border border-dashed border-[#3a4240] bg-black/20 p-4 text-sm text-[#a9afa9]">
      {message ?? "This FACEIT section is unavailable."}
    </p>
  );
};

export default Unavailable;
