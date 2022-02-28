import * as React from "react";
import AttributeForm from "../../../../components/attributes/attribuutForm";
import SubscriberForm from "../../../../components/subscribers/subscriberForm";

const IndexPage = (props) => {
  const subscriberId: string = props.params.subscriberId === "new" ? null : props.params.subscriberId;
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <SubscriberForm {...{ subscriberId, entityId }} />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
