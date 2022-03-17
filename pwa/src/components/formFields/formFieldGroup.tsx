import * as React from "react";
import { FieldErrors } from "react-hook-form";
import { IFormFieldProps } from "./types";

interface IFormFieldGroupProps {
  errors: FieldErrors;
  required?: boolean;
}

export const InputGroup: React.FC<IFormFieldGroupProps & IFormFieldProps> = (props) => (
  <div className="FormField-group">
    <label htmlFor={props.name}>
      {props.label}
      {props.required && <b>*</b>}
    </label>
    {props.children}
    {props.errors[props.name] && props.errors[props.name].message}
  </div>
);
