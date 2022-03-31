import { FieldErrors, FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";

export interface IReactHookFormProps {
  register?: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  validation?: Omit<RegisterOptions<FieldValues, any>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

export interface IFormFieldProps {
  label: string;
  name: string;
  tooltipContent?: JSX.Element | string;
}

export interface ISelectValue {
  label: string;
  value: string;
}
