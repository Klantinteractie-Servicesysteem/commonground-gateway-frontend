import * as React from "react";
import "./createArray.css";
import { Control, Controller, FieldValues } from "react-hook-form";
import { FormFieldGroup } from "../formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

/**
 * Export CreateArray input component (wrapped in FormFieldGroup)
 */
interface CreateArrayProps {
  control: Control<FieldValues, any>;
  data?: string[];
}

export const CreateArray: React.FC<CreateArrayProps & IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  errors,
  control,
  validation,
  tooltipContent,
  data,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors, tooltipContent }} required={!!validation?.required}>
      <Controller
        {...{ control, name }}
        rules={validation}
        render={({ field: { onChange } }) => {
          return <KeyValueComponent handleChange={onChange} {...{ data }} />;
        }}
      />
    </FormFieldGroup>
  );
};

/**
 * Internal CreateArray (contains all required logic)
 */
interface CreateArrayComponentProps {
  data?: string[];
  handleChange: (...event: any[]) => void;
}

const KeyValueComponent: React.FC<CreateArrayComponentProps> = ({ data, handleChange }) => {
  const [currentValue, setCurrentValue] = React.useState<string>("");
  const [values, setValues] = React.useState<string[]>(data ?? []);

  const currentValueRef = React.useRef(null);

  const handleCreate = (): void => {
    setValues([...values, currentValue]);

    setCurrentValue("");
  };

  React.useEffect(() => {
    handleChange(values);
  }, [values]);

  return (
    <div className="CreateArray">
      {values && (
        <table className="CreateArray-table table">
          <thead>
            <tr>
              <th>Value</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {values.map((value, idx) => (
              <tr key={`${value}${idx}`}>
                <td>{value}</td>
                <td className="CreateArray-table-tdDelete">
                  <button
                    className="utrecht-button btn-danger"
                    onClick={() => setValues(values.filter((_value) => _value !== value))}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="CreateArray-form">
        <input
          type="text"
          placeholder="Value"
          value={currentValue}
          ref={currentValueRef}
          className="FormField-field"
          onChange={(e) => setCurrentValue(e.target.value)}
        />

        <button type="button" className="utrecht-button btn-success" onClick={handleCreate} disabled={!currentValue}>
          <FontAwesomeIcon icon={faPlus} /> Create
        </button>
      </div>
    </div>
  );
};
