import * as React from "react"
import Layout from "../../components/common/layout";
import ObjectEntityForm from "../../components/object_entities/object_entityForm";

const IndexPage = (props) => {
  return (
    <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            <ObjectEntityForm id={props.params.id}/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
