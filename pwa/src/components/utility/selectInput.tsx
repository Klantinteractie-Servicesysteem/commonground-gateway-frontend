import * as _ from "lodash";
import * as React from "react";

interface SelectInputProps {
  options: Array<Partial<Record<"value" | "name" | "id" | "selected", any>>>;
  name: string;
  nameOverride?: string;
  value?: string;
  data?: string;
  id: string;
  required?: boolean;
  onChange?: any;
  disabled?: boolean;
}


/**
 * This component generates a select input.
 * @returns Jsx of the generated form.
 */
export const SelectInputForMultiSelect: React.FC<SelectInputProps> = ({
                                                                        options,
                                                                        name,
                                                                        nameOverride,
                                                                        value,
                                                                        id,
                                                                        data,
                                                                        required,
                                                                        onChange,
                                                                        disabled,
                                                                      }) => {
  return (
      <div className="input-group">
        <select
          {...{ name, id, required, disabled }}
          defaultValue={value ?? data}
          className="utrecht-select utrecht-select--html-select"
          onChange={onChange}
        >
          {!required && <option key={"empty"} />}
          {options.map((option, idx) => (
            <option key={idx} value={value ? `${value}${option.id}` : option.value}>
              {_.upperFirst(option.name)}
            </option>
          ))}
        </select>
      </div>
  );
};

SelectInputForMultiSelect.defaultProps = {
  required: false
};
