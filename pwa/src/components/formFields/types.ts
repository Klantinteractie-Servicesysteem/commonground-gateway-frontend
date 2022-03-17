import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export interface IReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  validation?: {
    required?: boolean;
  };
}

export interface IFormGroupProps {
  label: string;
  name: string;
}
