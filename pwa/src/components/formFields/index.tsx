import * as React from "react";
import "./index.css";
import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";
import { InputGroup } from "./formGroup";

interface IInputProps {
  name: string;
  label: string;
}

interface IReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  validation?: {
    required?: boolean;
  };
}

export const InputText = React.forwardRef<HTMLInputElement, IInputProps & IReactHookFormProps>(
  ({ name, label, errors, validation, register }, ref) => (
    <InputGroup {...{ name, label, errors }}>
      <input
        id={name}
        type="text"
        className="FormField-field"
        {...{ label, errors, ref, ...register(name, { ...validation }) }}
      />
    </InputGroup>
  ),
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, IInputProps & IReactHookFormProps>(
  ({ name, label, errors, validation, register }, ref) => (
    <InputGroup {...{ name, label, errors }}>
      <textarea
        id={name}
        className="FormField-field"
        {...{ label, errors, ref, ...register(name, { ...validation }) }}
      />
    </InputGroup>
  ),
);
