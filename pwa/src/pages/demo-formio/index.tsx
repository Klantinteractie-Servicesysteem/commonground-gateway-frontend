import * as React from "react"
import Layout from "../../components/common/layout";

import ReactDOM from 'react-dom'
import { Form } from '@formio/react'

const DemoFormio = () => {
  const formRef = React.useRef(null)

  const form = (
    <Form
      src="https://wqwlsnwkhpfrevh.form.io/demoform"
      onSubmit={(e) => console.log(e.data)}
    />
  )

  React.useEffect(() => {
    ReactDOM.render(form, formRef.current);
  })

  return (
    <Layout title={"Demo Form.io"}>
      <div ref={formRef} />
    </Layout>
  )
}

export default DemoFormio
