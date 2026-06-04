import type { ComponentProps } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

export interface IField<T extends FieldValues> extends Omit<
  ComponentProps<"input">,
  "onChange" | "onChangeText" | "value"
> {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: Omit<
    RegisterOptions<T, FieldPath<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
}
