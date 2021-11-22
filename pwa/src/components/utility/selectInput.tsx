import * as _ from "lodash";
import * as React from "react";

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
      <select name={name ?? target} id={id} className="utrecht-select utrecht-select--html-select">
        {
          selectOptions
        }
      </select>
    </>
  )
}
