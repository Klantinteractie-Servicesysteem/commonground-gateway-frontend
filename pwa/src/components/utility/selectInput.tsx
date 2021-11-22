import * as _ from "lodash";
import * as React from "react";

/**
 * This components handles select inputs.
 *
 * @param {object} options Either object used for the map or null.
 * @param {string} target Target that holds the array data.
 * @param {string|null} name Name used for the labels.
 * @param {string|null} id Id used for the select and options.
 * @param {object|null} data data for the check.
 * @returns Jsx of the generated form.
 */
export const SelectInputComponent = ({options, target, id, data = null, name = null}) => {
  const selectOptions = options.map((option) =>
    data !== undefined &&
    data !== null &&
    data == option.name ?
      <option selected value={option.value} id={target}>
        {_.upperFirst(option.name)}
      </option>
      :
      <option value={option.value} id={target}>
        {_.upperFirst(option.name)}
      </option>
  )

  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name ?? target)}</span>
      <select name={target} id={id} className="utrecht-select utrecht-select--html-select">
        {
          selectOptions
        }
      </select>
    </>
  )
}
