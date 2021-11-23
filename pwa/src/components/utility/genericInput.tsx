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
 * @returns Jsx of the generated form.
 */
export const GenericInputComponent = ({type, target, id, data = null, name = null}) => {
  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name ?? target)}</span>
      <input
        className="utrecht-textbox utrecht-textbox--html-input"
        name={target}
        id={id}
        defaultValue={data == null ? false : data}
        type={type}
      />
    </>
  );
};
