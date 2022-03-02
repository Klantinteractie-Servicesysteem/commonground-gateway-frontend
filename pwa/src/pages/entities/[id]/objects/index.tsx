import { navigate } from "gatsby-link";
import * as React from "react";

const IndexPage = (props) => {
    console.log({props:props})
  navigate(`/entities/${props.params.id}`, {
    state: { activeTab: "objects" },
  });

  return <></>;
};

export default IndexPage;
