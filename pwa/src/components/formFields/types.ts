import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export interface IReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  validation?: {
    required?: boolean;
    maxLenght?: number;
    minLength?: number;
    max?: number;
    min?: number;
    pattern?: RegExp;
  };
}

export interface IFormFieldProps {
  label: string;
  name: string;
}
