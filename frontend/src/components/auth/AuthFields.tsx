import type { Control } from "react-hook-form";
import type { AuthFormData } from "../../types/auth.interface";
import type { FC } from "react";
import { validEmail } from "../../shared/email.regex";
import Field from "../field/Field";

interface AuthFields {
  control: Control<AuthFormData>;
  autoCompletePassword?: "current-password" | "new-password";
}

const AuthFields: FC<AuthFields> = ({
  control,
  autoCompletePassword = "current-password",
}) => {
  return (
    <div className="space-y-4">
      <Field
        placeholder="Enter email"
        control={control}
        name="email"
        type="email"
        autoComplete="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: validEmail,
            message: "Please enter a valid email address",
          },
        }}
      />
      <Field
        placeholder="Enter password"
        control={control}
        name="password"
        type="password"
        autoComplete={autoCompletePassword}
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password should contain at least 6 characters",
          },
        }}
      />
    </div>
  );
};

export default AuthFields;
