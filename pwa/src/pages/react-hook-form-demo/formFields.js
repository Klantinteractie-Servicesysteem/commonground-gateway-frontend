import * as React from "react"
import ErrorMessage from './errorMessage'

export const InputText = React.forwardRef(({ onChange, onBlur, name, label, errors }, ref) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input type="text" {...{onChange, onBlur, name, label, errors, ref}} id={name} />
    {errors[name] && <ErrorMessage error={errors[name]} />}
  </div>
))

export const Textarea = React.forwardRef(({ onChange, onBlur, name, label, errors }, ref) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <textarea {...{onChange, onBlur, name, label, errors, ref}} id={name} />
    {errors[name] && <ErrorMessage error={errors[name]} />}
  </div>
))

export const Select = React.forwardRef(({ onChange, onBlur, name, label, errors, options, defaultValue }, ref) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <select {...{onChange, onBlur, name, label, errors, defaultValue, ref}} id={name}>
      {options.map((option) => (
        <option value={option.value} disabled={option.disabled}>{option.label}</option>
      ))}
    </select>
    {errors[name] && <ErrorMessage error={errors[name]} />}
  </div>
))
