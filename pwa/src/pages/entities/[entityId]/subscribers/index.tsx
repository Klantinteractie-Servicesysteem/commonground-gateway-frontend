import { navigate } from "gatsby-link";
import * as React from "react";

const IndexPage = (props) => {
  navigate(`/entities/${props.params.entityId}`, {
    state: { activeTab: "subscribers" },
  });

  return <></>;
};

export default IndexPage;
