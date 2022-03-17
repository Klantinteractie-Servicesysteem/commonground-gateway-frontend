import * as React from "react";
import { FieldErrors } from "react-hook-form";

interface IInputGroupProps {
  name: string;
  label: string;
  errors: FieldErrors;
}

export const InputGroup: React.FC<IInputGroupProps> = (props) => (
  <div className="FormField-group">
    <label htmlFor={props.name}>{props.label}</label>
    {props.children}
    {props.errors[props.name] && props.errors[props.name].message}
  </div>
);
