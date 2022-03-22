import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export interface IReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  validation?: {
    required?: {
      value: boolean;
      message?: string;
    };
    maxLenght?: {
      value: number;
      message?: string;
    };
    minLength?: {
      value: number;
      message?: string;
    };
    max?: {
      value: number;
      message?: string;
    };
    min?: {
      value: number;
      message?: string;
    };
    pattern?: {
      value: RegExp;
      message?: string;
    };
  };
}

export interface IFormFieldProps {
  label: string;
  name: string;
}
