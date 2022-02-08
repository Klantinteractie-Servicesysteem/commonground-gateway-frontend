import * as React from "react"
import ObjectEntityForm from "../../../components/objectEntities/ObjectEntityForm";

const IndexPage = (props) => {
  const objectEntityId: string = props.params.id === "new" ? null : props.params.id
  const entityId: string = props.params.entity === "new" ? null : props.params.entity

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <ObjectEntityForm {...{objectEntityId, entityId}} />
        </div>
      </div>
    </main>
  )
}

export default IndexPage
