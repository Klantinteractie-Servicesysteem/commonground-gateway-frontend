import * as React from "react";
import { InputGroup } from "./formGroup";
import { IFormGroupProps, IReactHookFormProps } from "./types";

export const InputText: React.FC<IFormGroupProps & IReactHookFormProps> = ({
  name,
  label,
  errors,
  validation,
  register,
}) => (
  <InputGroup {...{ name, label, errors }} required={validation?.required}>
    <input
      id={name}
      type="text"
      className="FormField-field"
      {...{ label, errors, ...register(name, { ...validation }) }}
    />
  </InputGroup>
);
