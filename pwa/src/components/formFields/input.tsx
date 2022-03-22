import * as React from "react";
import { InputGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "./types";

export const InputText: React.FC<IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  errors,
  validation,
  register,
}) => (
  <InputGroup {...{ name, label, errors }} required={validation?.required}>
    <input id={name} type="text" className="FormField-field" {...{ label, ...register(name, { ...validation }) }} />
  </InputGroup>
);
