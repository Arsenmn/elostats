import cn from "clsx";
import { Controller, type FieldValues } from "react-hook-form";
import type { IField } from "./field.interface";
import type { JSX } from "react";

const Field = <T extends FieldValues>({
  control,
  rules,
  name,
  ...rest
}: IField<T>): JSX.Element => {
  return (
    <div>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <div>
            <div
              className={cn(
                "w-full border bg-[#05070d] px-4 pb-4 pt-2.5 transition-colors focus-within:border-[#22f5ff]",
                error ? "border-red-400" : "border-[#29324a]",
              )}
            >
              <input
                autoCapitalize="none"
                onChange={onChange}
                onBlur={onBlur}
                value={(value || "").toString()}
                className="w-full bg-transparent text-[#f4f7ff] outline-none placeholder:text-[#94a3b8]"
                {...rest}
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-200">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Field;
