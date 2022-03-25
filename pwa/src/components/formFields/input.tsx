import * as React from "react";
import { FormFieldGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "./types";

interface IInputProps {
  type: "text" | "checkbox";
}

export const Input: React.FC<IInputProps & IFormFieldProps & IReactHookFormProps> = ({
  type,
  name,
  label,
  errors,
  validation,
  register,
}) => (
  <FormFieldGroup {...{ name, label, errors }} required={!!validation?.required}>
    <input id={name} className="FormField-field" {...{ label, type, ...register(name, { ...validation }) }} />
  </FormFieldGroup>
);

export const InputText: React.FC<IFormFieldProps & IReactHookFormProps> = ({ ...rest }) => (
  <Input type="text" {...rest} />
);

export const InputCheckbox: React.FC<IFormFieldProps & IReactHookFormProps> = ({ ...rest }) => (
  <Input type="checkbox" {...rest} />
);
