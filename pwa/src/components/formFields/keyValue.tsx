import * as React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { FormFieldGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "./types";

/**
 * Export KeyValue input component (wrapped in FormFieldGroup)
 */
interface IKeyValueProps {
  control: Control<FieldValues, any>;
}

interface IKeyValue {
  key: string;
  value: string;
}

export const KeyValue: React.FC<IKeyValueProps & IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  errors,
  control,
  validation,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors }} required={!!validation?.required}>
      <Controller
        {...{ control, name }}
        rules={validation}
        render={({ field: { onChange } }) => {
          return <KeyValueComponent {...{ onChange }} />;
        }}
      />
    </FormFieldGroup>
  );
};

/**
 * Internal KeyValueComponent (contains all required logic)
 */
interface KeyValueComponentProps {
  data?: IKeyValue[];
  onChange: (...event: any[]) => void;
}

const KeyValueComponent: React.FC<KeyValueComponentProps> = ({ data, onChange }) => {
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
    onChange(keyValues);
  }, [keyValues]);

  return (
    <>
      <input type="text" value={currentKey} onChange={(e) => setCurrentKey(e.target.value)} ref={currentKeyRef} />
      <input type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} ref={currentValueRef} />

      <button type="button" onClick={handleCreate} disabled={!currentKey || !currentValue}>
        Create
      </button>
    </>
  );
};
