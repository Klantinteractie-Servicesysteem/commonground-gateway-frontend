import * as React from "react";
import HandlerForm from "../../../../components/handlers/handlerForm";

const IndexPage = (props) => {
  const handlerId: string = props.params.handlerId === "new" ? null : props.params.handlerId;
  const endpointId: string = props.params.endpointId === "new" ? null : props.params.endpointId;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <HandlerForm id={handlerId} endpointId={endpointId} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
