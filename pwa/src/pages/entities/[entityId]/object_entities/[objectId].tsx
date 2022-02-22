import * as React from "react";
import ObjectEntityForm from "../../../../components/objectEntities/ObjectEntityForm";

const IndexPage = (props) => {
  const objectId: string = props.params.objectId === "new" ? null : props.params.objectId;
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <ObjectEntityForm {...{ objectId, entityId }} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
