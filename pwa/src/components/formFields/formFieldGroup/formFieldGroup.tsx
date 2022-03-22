import * as React from "react";
import "./formFieldGroup.css";
import { FieldErrors } from "react-hook-form";
import { IFormFieldProps } from "../types";

interface IFormFieldGroupProps {
  errors: FieldErrors;
  required?: boolean;
}

export const InputGroup: React.FC<IFormFieldGroupProps & IFormFieldProps> = (props) => {
  const hasError: boolean = props.errors[props.name];

  return (
    <div className={`FormField-group ${hasError && "FormField-group--error"}`}>
      <label htmlFor={props.name}>
        {props.label}
        {props.required && <b>*</b>}
      </label>
      {props.children}

      <span className="FormField-group-errorMessage">{hasError && getErrorMessage(props.errors[props.name])}</span>
    </div>
  );
};

const getErrorMessage = (errors: FieldErrors): string => {
  if (errors.message) return errors.message;

  switch (errors.type) {
    case "required":
      return "This field is required";
    case "maxLength":
      return "Field contains too many characters";
    case "minLength":
      return "This field does not contain enough characters";
    case "max":
      return "This input is too small";
    case "min":
      return "This input is too large";
    case "pattern":
      return "This pattern is incorrect";
  }
};
