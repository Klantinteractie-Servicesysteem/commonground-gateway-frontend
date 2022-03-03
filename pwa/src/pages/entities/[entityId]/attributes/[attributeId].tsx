import * as React from "react";
import AttributeForm from "../../../../components/attributes/attributeForm";

const IndexPage = (props) => {
  const attributeId: string = props.params.attributeId === "new" ? null : props.params.attributeId;
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <AttributeForm {...{ attributeId, entityId }} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
