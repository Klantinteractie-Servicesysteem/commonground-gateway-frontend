import * as React from "react"
import Layout from "../../components/common/layout";
import AttributeForm from "../../components/attributes/attribuutForm";


const IndexPage = (props) => {
  return (
    <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            <AttributeForm id={props.params.id}/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
