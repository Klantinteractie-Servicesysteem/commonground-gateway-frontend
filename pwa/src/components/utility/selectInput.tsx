import * as _ from "lodash";
import * as React from "react";

export const SelectInputComponent = ({ options, target, data = null, name = null }) => {
  console.log(data)
  const selectOptionsData = options.map((option) =>
    data !== undefined &&
    data !== null &&
      data == option.name &&
    <option selected value="string" id={target}>
      {_.upperFirst(option.name)}
    </option>
  )

  const selectOptions = options.map((option) =>
    <option value="string" id={target}>
      {_.upperFirst(option.name)}
    </option>
  )

  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name ?? target)}</span>
      <select name="type" id="typeInput" className="utrecht-select utrecht-select--html-select">
        {
          selectOptionsData
        }
        {
          selectOptions
        }
      </select>
    </>
  )
}
