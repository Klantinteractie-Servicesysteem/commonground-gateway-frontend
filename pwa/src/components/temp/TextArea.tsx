import * as _ from "lodash";
import * as React from "react";

interface TextAreaProps {
  id: string;
  data?: string | number;
  name: string;
  nameOverride?: string;
  required?: boolean;
  cols?: null | number;
  rows?: null | number;
  disabled?: boolean;
}

/**
 * This component generates a input element with the specified type.
 *
 * @returns Jsx of the generated form.
 */
export const TextAreaComponent = (props: TextAreaProps) => {
  return (
    <>
      <div className="input-group">
        <label htmlFor={props.id} className="utrecht-form-label">
          {_.upperFirst(props.nameOverride ?? props.name)}
          {props.required && " *"}
        </label>
        <input
          className="utrecht-textbox utrecht-textbox--html-input"
          name={props.name}
          id={props.id}
          defaultValue={props.data === null ? undefined : props.data}
          type={props.type}
          required={props.required}
          minLength={props.minLength === null ? undefined : props.minLength}
          maxLength={props.maxLength === null ? undefined : props.maxLength}
          disabled={props.disabled}
        />
      </div>
    </>
  );
};

GenericInputComponent.defaultProps = {
  data: null,
  disabled: false,
  required: false,
  minLength: null,
  maxLength: null,
};
