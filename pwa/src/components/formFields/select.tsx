import * as React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import ReactSelect from "react-select";
import { FormFieldGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps, ISelectValue } from "./types";

interface ISelectProps {
  control: Control<FieldValues, any>;
  options: ISelectValue[];
}

export const SelectMultiple: React.FC<ISelectProps & IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  options,
  errors,
  control,
  tooltipContent,
  validation,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors, tooltipContent }} required={!!validation?.required}>
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
  tooltipContent,
  validation,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors, tooltipContent }} required={!!validation?.required}>
      <Controller
        {...{ control, name }}
        rules={validation}
        render={({ field: { onChange, value } }) => {
          return <ReactSelect {...{ options, onChange, value }} isClearable className="Select" />;
        }}
      />
    </FormFieldGroup>
  );
};
