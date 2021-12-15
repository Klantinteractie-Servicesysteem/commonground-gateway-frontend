import * as _ from "lodash";
import * as React from "react";

interface SelectInputProps {
  options: Array<Record<"value"|"name", any>>;
  name: string;
  nameOverride?: string;
  id: string;
  data?: string;
  required?: boolean;
}

/**
 * This component generates a select input.
 * @returns Jsx of the generated form.
 */
export const SelectInputComponent = (props: SelectInputProps) => {
  return (
    <>
      <div className="input-group">
      <label className="utrecht-form-label" htmlFor={props.id}>{_.upperFirst(props.nameOverride ?? props.name)}</label>
      <select name={props.name} id={props.id} required={props.required} className="utrecht-select utrecht-select--html-select">
        {
          !props.required &&
            <option> </option>
        }
        {props.options.map((option) => (
          <option
            key={option.value}
            selected={props.data == null ? false : props.data === option.value}
            value={option.value}
          >
            {_.upperFirst(option.name)}
          </option>
        ))}
      </select>
      </div>
    </>
  );
};

SelectInputComponent.defaultProps = {
  required: false,
};
