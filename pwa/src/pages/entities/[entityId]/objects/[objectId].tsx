import * as React from "react";
import ObjectEntityFormNew from "../../../../components/objectEntities/objectEntityFormNew/ObjectEntityFormNew";
import { HeaderContext } from "../../../../context/headerContext";

const IndexPage = (props) => {
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId;
  const objectId: string = props.params.objectId === "new" ? null : props.params.objectId;
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({title: "Object", subText: "Edit or view your object"})
  }, [setHeader]);

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <ObjectEntityFormNew {...{ entityId, objectId }} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
