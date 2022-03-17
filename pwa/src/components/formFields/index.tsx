import * as React from "react";
import "./index.css";
import { FieldValues, UseFormRegister, FieldErrors, Controller, Control } from "react-hook-form";

import { InputGroup } from "./formGroup";
import Select from "react-select";

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
    <InputGroup {...{ name, label, errors }} required={validation?.required}>
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
    <InputGroup {...{ name, label, errors }} required={validation?.required}>
      <textarea
        id={name}
        className="FormField-field"
        {...{ label, errors, ref, ...register(name, { ...validation }) }}
      />
    </InputGroup>
  ),
);

interface ISelectProps {
  control: Control<FieldValues, any>;
  options: {
    value: string;
    label: string;
  }[];
}

export const SelectMultiple: React.FC<IInputProps & ISelectProps & IReactHookFormProps> = ({
  name,
  label,
  options,
  errors,
  control,
  validation,
}) => {
  return (
    <InputGroup {...{ name, label, errors }} required={validation?.required}>
      <Controller
        {...{ control, name }}
        rules={validation}
        render={({ field: { onChange, value } }) => {
          return <Select isMulti {...{ options, value, onChange }} />;
        }}
      />
    </InputGroup>
  );
};
