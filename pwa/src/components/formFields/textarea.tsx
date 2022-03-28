import * as React from "react";

import { FormFieldGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "./types";

export const Textarea: React.FC<IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  errors,
  validation,
  register,
}) => (
  <FormFieldGroup {...{ name, label, errors }} required={validation?.required}>
    <textarea id={name} className="FormField-field" {...{ label, ...register(name, { ...validation }) }} />
  </FormFieldGroup>
);
