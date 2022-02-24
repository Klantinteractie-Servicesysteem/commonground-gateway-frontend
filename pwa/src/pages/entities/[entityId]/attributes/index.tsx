import { navigate } from "gatsby-link";
import * as React from "react";

const IndexPage = (props) => {
  navigate(`/entities/${props.params.entityId}`, {
    state: { activeTab: "attributes" },
  });

  return <></>;
};

export default IndexPage;
