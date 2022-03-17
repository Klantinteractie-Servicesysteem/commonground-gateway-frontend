import * as React from "react";

import { InputGroup } from "./formGroup";
import { IFormGroupProps, IReactHookFormProps } from "./types";

export const Textarea: React.FC<IFormGroupProps & IReactHookFormProps> = ({
  name,
  label,
  errors,
  validation,
  register,
}) => (
  <InputGroup {...{ name, label, errors }} required={validation?.required}>
    <textarea id={name} className="FormField-field" {...{ label, errors, ...register(name, { ...validation }) }} />
  </InputGroup>
);
