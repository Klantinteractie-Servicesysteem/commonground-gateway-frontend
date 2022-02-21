import * as React from "react";
import Layout from "../../../../components/common/layout";
import AttributeForm from "../../../../components/attributes/attribuutForm";

const IndexPage = (props) => {
  const attributeId: string = props.params.attributeId === "new" ? null : props.params.attributeId
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId

  return (
    <Layout title={"Properties"} subtext={"Create or edit your properties"}>
      <main>
        <div className="row">
          <div className="col-12">
            <AttributeForm {...{attributeId, entityId}} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
