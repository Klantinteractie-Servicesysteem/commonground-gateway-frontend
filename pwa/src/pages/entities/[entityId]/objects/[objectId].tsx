import * as React from "react";
import ObjectEntityFormNew from "../../../../components/objectEntities/objectEntityForm/ObjectEntityForm";
import { HeaderContext } from "../../../../context/headerContext";

const IndexPage = (props) => {
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId;
  const objectId: string = props.params.objectId === "new" ? null : props.params.objectId;
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader("Object");
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
