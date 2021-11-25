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
 * @param {string|null} valueOption value for the option.
 * @returns Jsx of the generated form.
 */
export const SelectInputComponent = ({ options, target, id, data = null, name = null, valueOption = null }) => {
  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name ?? target)}</span>
      <select name={target} id={id} className="utrecht-select utrecht-select--html-select">
        {options.map(option => (
          <option
            selected={data == null ? false : data == option.name ? true : false}
            value={valueOption !== null ? `${valueOption}${option.id}` : option.value}
            id={target}
          >
            {_.upperFirst(option.name)}
          </option>
        ))}
      </select>
    </>
  );
};
