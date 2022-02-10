import * as _ from "lodash";
import * as React from "react";

interface TextareaGroupProps {
  id: string,
  name: string,
  defaultValue?: string,
  label?: string,
  required?: boolean,
  disabled?: boolean,
}

/**
 * This component generates a input element with the specified type.
 *
 * @returns Jsx of the generated form.
 */
export const TextareaGroup: React.FC<TextareaGroupProps> = (
  {
    id,
    defaultValue,
    name,
    label,
    required,
    disabled,
  }) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="utrecht-form-label">
        {_.upperFirst(label ?? name)}
        {required && " *"}
      </label>

      <textarea maxLength={500} className="utrecht-textarea form-control" {...{ id, defaultValue, name, required, disabled }} />
    </div>
  );
};
