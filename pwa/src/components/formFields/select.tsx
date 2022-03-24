import * as React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import ReactSelect from "react-select";
import { FormFieldGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "./types";

interface ISelectProps {
  control: Control<FieldValues, any>;
  options: {
    value: string;
    label: string;
  }[];
  isMulti?: boolean;
}

export const SelectMultiple: React.FC<ISelectProps & IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  options,
  errors,
  control,
  validation,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors }} required={!!validation?.required}>
      <Controller
        {...{ control, name }}
        rules={validation}
        render={({ field: { onChange, value } }) => {
          return <ReactSelect isMulti {...{ options, value, onChange }} className="Select" />;
        }}
      />
    </FormFieldGroup>
  );
};

export const SelectSingle: React.FC<ISelectProps & IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  options,
  errors,
  control,
  validation,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors }} required={!!validation?.required}>
      <Controller
        {...{ control, name }}
        rules={validation}
        render={({ field: { onChange, value } }) => {
          return <ReactSelect {...{ options, value, onChange }} isClearable className="Select" />;
        }}
      />
    </FormFieldGroup>
  );
};
