import * as React from "react"
import Layout from "../../../../components/common/layout";
import ObjectEntityForm from "../../../../components/objectEntities/ObjectEntityForm";

const IndexPage = (props) => {
  const objectId: string = props.params.objectId === "new" ? null : props.params.objectId
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId

  return (
    <Layout title='Object' subtext="Create or edit your object">
      <main>
        <div className="row">
          <div className="col-12">
            <ObjectEntityForm {...{objectId, entityId}} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
