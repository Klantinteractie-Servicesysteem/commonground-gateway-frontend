import * as React from "react";

import { useForm } from "react-hook-form";
import { InputText, KeyValue } from "../components/formFields";

const IndexPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputText name="name" label="Name" {...{ register, errors }} />

      <KeyValue name="keyValue" label="Key Value" {...{ control, errors, register }} validation={{ required: true }} />

      <input type="submit" />
    </form>
  );
};

export default IndexPage;
