import * as React from "react"
import Layout from "../../components/common/layout"
import './index.css'
import { useForm } from "react-hook-form"

import { InputText, Textarea, Select } from './formFields'

const DemoPage = ({}) => {
  const { register, formState: {errors}, handleSubmit } = useForm()
  const onSubmit = (data) => {
    console.log(data)
    // send data to API-service
  }

  return (
    <Layout title={"React Form Hook Demo"}>

      <form className="demoPage-form" onSubmit={handleSubmit(onSubmit)}>
        <InputText label="Naam" errors={errors} {...register('name', {required: true})} />
        <Textarea label="Omschrijving" errors={errors} {...register('description', {required: true, minLength: 25})} />
        <Select
          label="Functie"
          options={[
            {value: "", label: "Selecteer een functie", disabled: true},
            {value: "organization", label: "Organization"},
            {value: "user", label: "User"},
            {value: "user-group", label: "User group"},
          ]}
          defaultValue=""
          errors={errors}
          {...register('function', {required: true})}
        />
        <InputText label="Endpoint" errors={errors} {...register('endpoint', {required: true})} />
        <InputText label="Route" errors={errors} {...register('route')} />
        <InputText label="Source" errors={errors} {...register('source')} />
        <InputText label="To Soap" errors={errors} {...register('to-soap', {required: true})} />

        <input type="submit" />
      </form>

    </Layout>
  )
}

export default DemoPage;
