import { navigate } from "gatsby-link";
import * as React from "react";

const IndexPage = (props) => {
  navigate(`/endpoints/${props.params.endpointId}`, {
    state: { activeTab: "handlers" },
  });

  return <></>;
};

export default IndexPage;
