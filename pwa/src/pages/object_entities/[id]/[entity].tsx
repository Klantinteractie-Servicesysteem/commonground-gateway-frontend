import * as React from "react"
import Layout from "../../../components/common/layout";
import ObjectEntityForm from "../../../components/object_entities/dataForm";

const IndexPage = ({ id, entityId}) => {
  return (
    <Layout title='Object entity' subtext="Edit your object entity here">
      <main>
        <div className="row">
          <div className="col-12">
            <ObjectEntityForm id={id} entityId={entityId}/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
