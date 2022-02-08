import * as React from "react";
import HandlerForm from "../../../components/handlers/handlerForm";

const IndexPage = ({id, endpoint}) => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <HandlerForm id={id} endpointId={endpoint}/>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
