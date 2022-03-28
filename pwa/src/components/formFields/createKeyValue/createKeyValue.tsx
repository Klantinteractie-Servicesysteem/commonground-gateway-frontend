import * as React from "react";
import "./createKeyValue.css";
import { Control, Controller, FieldValues } from "react-hook-form";
import { FormFieldGroup } from "../formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

/**
 * Export KeyValue input component (wrapped in FormFieldGroup)
 */
interface CreateKeyValueProps {
  control: Control<FieldValues, any>;
  data?: IKeyValue[];
}

interface IKeyValue {
  key: string;
  value: string;
}

export const CreateKeyValue: React.FC<CreateKeyValueProps & IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  errors,
  control,
  validation,
  data,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors }} required={!!validation?.required}>
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
 * Internal KeyValueComponent (contains all required logic)
 */
interface CreateKeyValueComponentProps {
  data?: IKeyValue[];
  handleChange: (...event: any[]) => void;
}

const KeyValueComponent: React.FC<CreateKeyValueComponentProps> = ({ data, handleChange }) => {
  const [currentKey, setCurrentKey] = React.useState<string>("");
  const [currentValue, setCurrentValue] = React.useState<string>("");
  const [keyValues, setKeyValues] = React.useState<IKeyValue[]>(data ?? []);

  const currentKeyRef = React.useRef(null);
  const currentValueRef = React.useRef(null);

  const handleCreate = (): void => {
    const keyValue: IKeyValue = { key: currentKey, value: currentValue };

    setCurrentKey("");
    setCurrentValue("");

    setKeyValues([...keyValues, keyValue]);
  };

  React.useEffect(() => {
    handleChange(keyValues);
  }, [keyValues]);

  return (
    <div className="KeyValue">
      {keyValues && (
        <table className="KeyValue-table table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {keyValues.map((keyValue, idx) => (
              <tr key={`${keyValue}${idx}`}>
                <td>{keyValue.key}</td>
                <td>{keyValue.value}</td>
                <td className="KeyValue-table-tdDelete">
                  <button
                    className="utrecht-button btn-danger"
                    onClick={() => setKeyValues(keyValues.filter((_keyValue) => _keyValue !== keyValue))}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="KeyValue-form">
        <input
          type="text"
          placeholder="Key"
          value={currentKey}
          ref={currentKeyRef}
          className="FormField-field"
          onChange={(e) => setCurrentKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={currentValue}
          ref={currentValueRef}
          className="FormField-field"
          onChange={(e) => setCurrentValue(e.target.value)}
        />

        <button
          type="button"
          className="utrecht-button btn-success"
          onClick={handleCreate}
          disabled={!currentKey || !currentValue}
        >
          <FontAwesomeIcon icon={faPlus} /> Create
        </button>
      </div>
    </div>
  );
};
