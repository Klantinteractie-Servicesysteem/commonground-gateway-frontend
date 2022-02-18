import * as React from "react";
import Layout from "../../../../components/common/layout";
import HandlerForm from "../../../../components/handlers/handlerForm";

const IndexPage = (props) => {
  const handlerId: string = props.params.handlerId === "new" ? null : props.params.handlerId
  const endpointId: string = props.params.endpointId === "new" ? null : props.params.endpointId

  return (
    <Layout title={"Handler properties"} subtext={"Create or edit your properties"}>
      <main>
        <div className="row">
          <div className="col-12">
            <HandlerForm id={handlerId} endpointId={endpointId} />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
