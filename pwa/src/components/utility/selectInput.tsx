import * as _ from "lodash";
import * as React from "react";

interface SelectInputProps {
  options: Record<any, any>
  name: string
  nameOverride?: string
  id: string
  data?: string
}

/**
 * This components handles select inputs.
 * @param {object} props The needed properties from the selectInputProps.
 * @returns Jsx of the generated form.
 */
export const SelectInputComponent = (props: SelectInputProps) => {
  return (
    <>
      <label className="utrecht-form-label" htmlFor={props.id}>{_.upperFirst(props.name ?? props.nameOverride)}</label>
      <select name={props.name} id={props.id} className="utrecht-select utrecht-select--html-select">
        {props.options.map((option) => (
          <option
            selected={props.data == null ? false : props.data == option.name ? true : false}
            value={props.data == null ? null : props.data}
            id={props.name}
          >
            {_.upperFirst(option.name)}
          </option>
        ))}
      </select>
    </>
  );
};
