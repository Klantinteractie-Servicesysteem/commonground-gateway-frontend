import * as React from "react";
import AttributeForm from "../../../components/attributes/attribuutForm";

const IndexPage = (props) => {
  const attributeId: string = props.params.id === "new" ? null : props.params.id
  const entityId: string = props.params.entity === "new" ? null : props.params.entity

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <AttributeForm {...{attributeId, entityId}} />
        </div>
      </div>
    </main>
  )
}

export default IndexPage;
