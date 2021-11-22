import * as _ from "lodash";
import * as React from "react";

export const CheckboxComponent = ({type, id, defaultValue = null, data = null, nameLabel, nameAttribute}) => {

  const checkboxData = () => {
    return (
        data ?
        <input
          className="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
          type={type}
          id={id}
          name={nameAttribute}
          defaultChecked={true}
          defaultValue={defaultValue}
        />
        :
        <input
          className="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
          type={type}
          id={id}
          name={nameAttribute}
          defaultValue={defaultValue}
        />
    )
  }

  return (
    <>
      <div className="form-check">
        { checkboxData }
        <label className="form-check-label" htmlFor={id}>
          {_.upperFirst(nameLabel)}
        </label>
      </div>
    </>
  )
}
