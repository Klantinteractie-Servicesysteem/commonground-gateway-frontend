import { Control, Controller, FieldValues } from "react-hook-form";
import { FormFieldGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "./types";

interface IKeyValueProps {
  control: Control<FieldValues, any>;
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
          return (
            <form onChange={onChange}>
              <input name="key" type="text" />
              <input name="value" type="text" />
              <input type="submit" />
            </form>
          );
        }}
      />
    </FormFieldGroup>
  );
};
