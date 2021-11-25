import * as _ from "lodash";
import * as React from "react";

/**
 * This components handles generic inputs.
 *
 * @param {string} type The type of the input.
 * @param {string} target Target that holds the array data.
 * @param {string|null} name Name used for the labels.
 * @param {string|null} id Id used for the input.
 * @param {object|null} data data for the check.
 * @param {boolean|false} required if the input is required.
 * @param {string|null} minLength the minLength of the input.
 * @param {string|null} maxLength the maxLength of the input.
 * @returns Jsx of the generated form.
 */
export const GenericInputComponent = ({
  type,
  target,
  id,
  data = null,
  name = null,
  required = false,
  minLength = null,
  maxLength = null,
}) => {
  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name ?? target)}</span>
      <input
        className="utrecht-textbox utrecht-textbox--html-input"
        name={target}
        id={id}
        defaultValue={data == null ? null : data}
        type={type}
        required={required != false}
        minLength={minLength == null ? false : minLength}
        maxLength={maxLength == null ? false : maxLength}
      />
    </>
  );
};
