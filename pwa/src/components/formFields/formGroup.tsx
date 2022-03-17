import * as React from "react";
import { FieldErrors } from "react-hook-form";

interface IInputGroupProps {
  name: string;
  label: string;
  errors: FieldErrors;
  required?: boolean;
}

export const InputGroup: React.FC<IInputGroupProps> = (props) => (
  <div className="FormField-group">
    <label htmlFor={props.name}>
      {props.label}
      {props.required && <b>*</b>}
    </label>
    {props.children}
    {props.errors[props.name] && props.errors[props.name].message}
  </div>
);
