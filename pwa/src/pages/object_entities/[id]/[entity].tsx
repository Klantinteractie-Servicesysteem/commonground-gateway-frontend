import * as React from "react"
import Layout from "../../../components/common/layout";
import ObjectEntityForm from "../../../components/object_entities/dataForm";

const IndexPage = (props) => {
  const entity_objectId: string = props.params.id === "new" ? null : props.params.id
  const entityId: string = props.params.entity === "new" ? null : props.params.entity

  return (
    <Layout title='Object entity' subtext="Create or edit your object entities">
      <main>
        <div className="row">
          <div className="col-12">
            <ObjectEntityForm {...{entity_objectId, entityId}} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
